"""
Photoreal render of the SPIRULI can with Blender Cycles (bpy).

  python render_can.py --label label-color.png --pbr label-pbr.png --out DIR
        [--mode turntable|still] [--frames 72] [--size 1080x1800] [--samples 128]

turntable: transparent PNG frames of a 360° turn, front facing camera at frame 0
still:     a single 4K (3840 × 2160) hero shot
env:       equirectangular HDR of the studio lights, for the real-time can

The can shape matches components/three/SpiruliCan.tsx (radius 0.58, label
height 2.92), so label artwork painted by lib/drawLabel.ts fits exactly.
"""
import argparse
import math
import sys

import bpy  # noqa: I001  (bpy must be imported before bmesh/mathutils)
import bmesh
from mathutils import Vector

R = 0.58
BODY_H = 2.92
TOP = BODY_H / 2

SHOULDER = [
    (R, 0), (0.579, 0.02), (0.572, 0.05), (0.556, 0.085), (0.535, 0.115), (0.515, 0.14), (0.506, 0.156),
    (0.507, 0.166), (0.512, 0.174), (0.514, 0.182), (0.51, 0.19), (0.502, 0.193), (0.495, 0.188),
    (0.492, 0.176), (0.489, 0.152), (0.48, 0.138), (0.468, 0.14), (0.455, 0.145), (0.0, 0.145),
]
BOTTOM = [
    (0.0, -0.03), (0.2, -0.036), (0.35, -0.052), (0.42, -0.078), (0.445, -0.093), (0.47, -0.097),
    (0.5, -0.09), (0.54, -0.074), (0.565, -0.048), (0.578, -0.02), (R, 0),
]


def args():
    p = argparse.ArgumentParser()
    p.add_argument("--label", required=True)
    p.add_argument("--pbr", required=True)
    p.add_argument("--out", required=True)
    p.add_argument("--mode", default="turntable")
    p.add_argument("--frames", type=int, default=72)
    p.add_argument("--first", type=int, default=0)
    p.add_argument("--last", type=int, default=-1)
    p.add_argument("--size", default="1080x1800")
    p.add_argument("--samples", type=int, default=128)
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else sys.argv[1:]
    return p.parse_args(argv)


def lathe(name, profile, y0, segments=256, uv_v=None):
    """Revolve (radius, height) points around Z. Angle convention matches three.js:
    u = 0.5 faces -Y (the camera), u increases to the right."""
    bm = bmesh.new()
    uv = bm.loops.layers.uv.new()
    rings = []
    for r, h in profile:
        ring = []
        for j in range(segments + 1):
            u = j / segments
            th = math.pi + 2 * math.pi * u
            ring.append(bm.verts.new((r * math.sin(th), -r * math.cos(th), y0 + h)))
        rings.append(ring)
    for i in range(len(profile) - 1):
        for j in range(segments):
            vs = (rings[i][j], rings[i][j + 1], rings[i + 1][j + 1], rings[i + 1][j])
            if len({v.co.to_tuple(6) for v in vs}) < 3:
                continue
            f = bm.faces.new(vs)
            for loop, (a, b) in zip(f.loops, ((i, j), (i, j + 1), (i + 1, j + 1), (i + 1, j))):
                v = uv_v[a] if uv_v else 0.5
                loop[uv].uv = (b / segments, v)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    ob = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(ob)
    return ob


def label_material(color_path, pbr_path):
    m = bpy.data.materials.new("Label")
    m.use_nodes = True
    nt = m.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    col = nt.nodes.new("ShaderNodeTexImage")
    col.image = bpy.data.images.load(color_path)
    col.interpolation = "Cubic"
    pbr = nt.nodes.new("ShaderNodeTexImage")
    pbr.image = bpy.data.images.load(pbr_path)
    pbr.image.colorspace_settings.name = "Non-Color"
    sep = nt.nodes.new("ShaderNodeSeparateColor")
    # A touch more saturation: the lacquer reads richer, like the print.
    hsv = nt.nodes.new("ShaderNodeHueSaturation")
    hsv.inputs["Saturation"].default_value = 1.15
    nt.links.new(col.outputs["Color"], hsv.inputs["Color"])
    nt.links.new(hsv.outputs["Color"], bsdf.inputs["Base Color"])
    nt.links.new(pbr.outputs["Color"], sep.inputs["Color"])
    nt.links.new(sep.outputs["Green"], bsdf.inputs["Roughness"])
    nt.links.new(sep.outputs["Blue"], bsdf.inputs["Metallic"])
    # Satin lacquer: a thin, slightly rough clear coat.
    bsdf.inputs["Coat Weight"].default_value = 0.12
    bsdf.inputs["Coat Roughness"].default_value = 0.32
    # Fine paint orange-peel.
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 900
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.025
    nt.links.new(noise.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], bsdf.inputs["Coat Normal"])
    return m


def aluminium():
    m = bpy.data.materials.new("Aluminium")
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (0.91, 0.92, 0.93, 1)
    b.inputs["Metallic"].default_value = 1
    b.inputs["Roughness"].default_value = 0.3
    b.inputs["Anisotropic"].default_value = 0.35
    # Circular brushing on lid and base.
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 2500
    noise.inputs["Detail"].default_value = 2
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.015
    nt.links.new(noise.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], b.inputs["Normal"])
    return m


def tab(mat):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -0.02, TOP + 0.152))
    t = bpy.context.object
    t.scale = (0.34, 0.3, 0.014)
    bpy.ops.object.transform_apply(scale=True)
    bev = t.modifiers.new("bevel", "BEVEL")
    bev.width = 0.06
    bev.segments = 8
    bev.limit_method = "ANGLE"
    bpy.ops.object.modifier_apply(modifier="bevel")
    bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=0.1, depth=0.1, location=(0, -0.08, TOP + 0.152))
    hole = bpy.context.object
    hole.scale = (1, 0.6, 1)
    boo = t.modifiers.new("hole", "BOOLEAN")
    boo.object = hole
    boo.operation = "DIFFERENCE"
    bpy.context.view_layer.objects.active = t
    bpy.ops.object.modifier_apply(modifier="hole")
    bpy.data.objects.remove(hole)
    t.data.materials.append(mat)
    bpy.ops.object.shade_smooth()
    bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=0.038, depth=0.025, location=(0, -0.06, TOP + 0.158))
    rivet = bpy.context.object
    rivet.data.materials.append(mat)
    bpy.ops.object.shade_smooth()
    return [t, rivet]


def softbox(name, loc, size, strength, rot):
    bpy.ops.mesh.primitive_plane_add(size=1, location=loc, rotation=rot)
    p = bpy.context.object
    p.name = name
    p.scale = (size[0], size[1], 1)
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.remove(nt.nodes["Principled BSDF"])
    em = nt.nodes.new("ShaderNodeEmission")
    em.inputs["Strength"].default_value = strength
    # Soft falloff toward the edges of the box, like diffusion fabric.
    tc = nt.nodes.new("ShaderNodeTexCoord")
    grad = nt.nodes.new("ShaderNodeTexGradient")
    grad.gradient_type = "SPHERICAL"
    mapping = nt.nodes.new("ShaderNodeMapping")
    mapping.inputs["Location"].default_value = (0.5, 0.5, 0)
    nt.links.new(tc.outputs["UV"], mapping.inputs["Vector"])
    mapping.inputs["Location"].default_value = (-0.5, -0.5, 0)
    mapping.inputs["Scale"].default_value = (1.6, 1.6, 1)
    nt.links.new(mapping.outputs["Vector"], grad.inputs["Vector"])
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.05
    ramp.color_ramp.elements[0].color = (0, 0, 0, 1)
    ramp.color_ramp.elements[1].position = 0.45
    nt.links.new(grad.outputs["Fac"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], em.inputs["Color"])
    nt.links.new(em.outputs["Emission"], nt.nodes["Material Output"].inputs["Surface"])
    p.data.materials.append(m)
    p.visible_camera = False
    p.visible_shadow = False
    return p


def scene(a):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.cycles.device = "CPU"
    sc.cycles.samples = a.samples
    sc.cycles.use_denoising = True
    sc.cycles.denoiser = "OPENIMAGEDENOISE"
    sc.render.film_transparent = True
    # Standard keeps the label's sRGB colours true to the artwork.
    sc.view_settings.view_transform = "Standard"
    sc.view_settings.look = "None"
    sc.view_settings.exposure = -0.45
    w, h = (int(x) for x in a.size.split("x"))
    sc.render.resolution_x, sc.render.resolution_y = w, h
    sc.render.resolution_percentage = 100
    sc.render.image_settings.file_format = "PNG"
    sc.render.image_settings.color_mode = "RGBA"
    sc.render.image_settings.compression = 30

    world = bpy.data.worlds.new("World")
    sc.world = world
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.035, 0.07, 0.075, 1)
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = 1

    alu = aluminium()
    lab = label_material(a.label, a.pbr)

    can = bpy.data.objects.new("Can", None)
    bpy.context.collection.objects.link(can)
    body = lathe("Body", [(R, 0), (R, BODY_H)], -TOP, uv_v=[0.0, 1.0])
    body.data.materials.append(lab)
    # The print runs over the shoulder and the lower curve, as on the real
    # can; only the rolled rim, lid and base ring stay bare aluminium. Those
    # printed parts sample the label's top / bottom row (plain lacquer).
    neck = 6  # SHOULDER index where the rolled rim begins
    foot = 8  # BOTTOM index where the print starts
    shoulder = lathe("Shoulder", SHOULDER[: neck + 1], TOP, uv_v=[0.997] * (neck + 1))
    shoulder.data.materials.append(lab)
    top = lathe("Top", SHOULDER[neck:], TOP)
    top.data.materials.append(alu)
    heel = lathe("Heel", BOTTOM[foot:], -TOP, uv_v=[0.003] * (len(BOTTOM) - foot))
    heel.data.materials.append(lab)
    bot = lathe("Bottom", BOTTOM[: foot + 1], -TOP)
    bot.data.materials.append(alu)
    parts = [body, shoulder, top, heel, bot] + tab(alu)
    for p in parts:
        p.parent = can

    # Ground: catches a soft contact shadow, invisible otherwise.
    bpy.ops.mesh.primitive_plane_add(size=40, location=(0, 0, -TOP - 0.097))
    ground = bpy.context.object
    ground.is_shadow_catcher = True

    # Studio: large key softbox, two strip lights for crisp metal edges,
    # a top box and a faint fill.
    softbox("Key", (-4.2, -3.2, 1.5), (3.2, 6), 9, (math.radians(90), 0, math.radians(-52)))
    softbox("StripL", (-3.6, 1.2, 0.5), (0.7, 7), 14, (math.radians(90), 0, math.radians(-110)))
    softbox("StripR", (3.6, 1.0, 0.5), (0.6, 7), 12, (math.radians(90), 0, math.radians(110)))
    softbox("Top", (0, -0.5, 5.0), (6, 5), 12, (0, 0, 0))
    softbox("Fill", (4.5, -4, 0.5), (3, 5), 2.5, (math.radians(90), 0, math.radians(48)))

    cam_data = bpy.data.cameras.new("Cam")
    cam = bpy.data.objects.new("Cam", cam_data)
    bpy.context.collection.objects.link(cam)
    sc.camera = cam
    return sc, can, cam


def aim(cam, target):
    d = Vector(target) - cam.location
    cam.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()


def main():
    a = args()
    sc, can, cam = scene(a)
    if a.mode == "turntable":
        cam.data.lens = 85
        cam.location = (0, -9.0, 0.75)
        aim(cam, (0, 0, 0.02))
        n = a.frames
        last = n - 1 if a.last < 0 else a.last
        for i in range(a.first, last + 1):
            # Front faces the camera at frame 0; positive frames turn the can left.
            can.rotation_euler = (0, 0, -2 * math.pi * i / n)
            sc.render.filepath = f"{a.out}/frame-{i:03d}.png"
            bpy.ops.render.render(write_still=True)
            print("frame", i, flush=True)
    elif a.mode == "env":
        # Equirectangular HDR of the studio (softboxes + world, no can) for
        # the real-time can's reflections. Centre of the image faces +X,
        # which is what three.js expects for equirectangular maps.
        for ob in bpy.data.objects:
            if ob.type == "MESH":
                is_box = ob.name in ("Key", "StripL", "StripR", "Top", "Fill")
                ob.visible_camera = is_box
                ob.hide_render = not is_box
        sc.render.film_transparent = False
        cam.data.type = "PANO"
        cam.data.panorama_type = "EQUIRECTANGULAR"
        cam.location = (0, 0, 0)
        cam.rotation_euler = (math.radians(90), 0, math.radians(-90))
        sc.render.image_settings.file_format = "HDR"
        sc.render.image_settings.color_mode = "RGB"
        sc.render.filepath = f"{a.out}/studio.hdr"
        bpy.ops.render.render(write_still=True)
    else:
        sc.render.film_transparent = False
        sc.world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.02, 0.06, 0.065, 1)
        cam.data.lens = 70
        cam.location = (1.6, -15.5, 2.6)
        aim(cam, (0.0, 0, 0.0))
        can.rotation_euler = (0, 0, math.radians(-12))
        sc.render.filepath = f"{a.out}/still.png"
        bpy.ops.render.render(write_still=True)


main()
