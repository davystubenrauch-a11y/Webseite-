"""
Photoreal ingredient props for the page, rendered with Blender Cycles as
transparent PNGs: lemon slices, elderberry clusters and leaves.

  python render_props.py -- --out DIR [--size 900] [--samples 64]

Writes lemon-a.png, lemon-b.png, berries-a.png, berries-b.png, leaf-a.png, leaf-b.png.
"""
import argparse
import math
import random
import sys

import bpy  # noqa: I001  (bpy must be imported before mathutils)
from mathutils import Vector


def args():
    p = argparse.ArgumentParser()
    p.add_argument("--out", required=True)
    p.add_argument("--size", type=int, default=900)
    p.add_argument("--samples", type=int, default=64)
    return p.parse_args(sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else [])


def mat(name, color, rough, sss=0.0, coat=0.0, transmission=0.0):
    m = bpy.data.materials.new(name)
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Subsurface Weight"].default_value = sss
    b.inputs["Subsurface Radius"].default_value = (0.4, 0.3, 0.1)
    b.inputs["Coat Weight"].default_value = coat
    b.inputs["Transmission Weight"].default_value = transmission
    return m


def lemon_flesh():
    """Radial segments with pulp grain, built from procedural nodes."""
    m = bpy.data.materials.new("Flesh")
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    nt.links.new(tc.outputs["Object"], sep.inputs["Vector"])
    # Angle around the centre → segment walls.
    atan = nt.nodes.new("ShaderNodeMath")
    atan.operation = "ARCTAN2"
    nt.links.new(sep.outputs["Y"], atan.inputs[0])
    nt.links.new(sep.outputs["X"], atan.inputs[1])
    mul = nt.nodes.new("ShaderNodeMath")
    mul.operation = "MULTIPLY"
    mul.inputs[1].default_value = 10 / (2 * math.pi)
    nt.links.new(atan.outputs[0], mul.inputs[0])
    frac = nt.nodes.new("ShaderNodeMath")
    frac.operation = "FRACT"
    nt.links.new(mul.outputs[0], frac.inputs[0])
    tri = nt.nodes.new("ShaderNodeMath")
    tri.operation = "PINGPONG"
    tri.inputs[1].default_value = 0.5
    nt.links.new(frac.outputs[0], tri.inputs[0])
    wall = nt.nodes.new("ShaderNodeMapRange")
    wall.inputs["From Min"].default_value = 0.0
    wall.inputs["From Max"].default_value = 0.06
    nt.links.new(tri.outputs[0], wall.inputs["Value"])
    # Radius → white centre and white pith ring.
    vlen = nt.nodes.new("ShaderNodeVectorMath")
    vlen.operation = "LENGTH"
    nt.links.new(tc.outputs["Object"], vlen.inputs[0])
    ring = nt.nodes.new("ShaderNodeMapRange")
    ring.inputs["From Min"].default_value = 0.86
    ring.inputs["From Max"].default_value = 0.8
    nt.links.new(vlen.outputs["Value"], ring.inputs["Value"])
    core = nt.nodes.new("ShaderNodeMapRange")
    core.inputs["From Min"].default_value = 0.05
    core.inputs["From Max"].default_value = 0.12
    nt.links.new(vlen.outputs["Value"], core.inputs["Value"])
    m1 = nt.nodes.new("ShaderNodeMath")
    m1.operation = "MULTIPLY"
    nt.links.new(wall.outputs[0], m1.inputs[0])
    nt.links.new(ring.outputs[0], m1.inputs[1])
    m2 = nt.nodes.new("ShaderNodeMath")
    m2.operation = "MULTIPLY"
    nt.links.new(m1.outputs[0], m2.inputs[0])
    nt.links.new(core.outputs[0], m2.inputs[1])
    # Pulp vesicles.
    vor = nt.nodes.new("ShaderNodeTexVoronoi")
    vor.inputs["Scale"].default_value = 38
    nt.links.new(tc.outputs["Object"], vor.inputs["Vector"])
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = (0.98, 0.78, 0.12, 1)
    ramp.color_ramp.elements[1].color = (0.85, 0.55, 0.02, 1)
    nt.links.new(vor.outputs["Distance"], ramp.inputs["Fac"])
    mix = nt.nodes.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.inputs["A"].default_value = (0.95, 0.9, 0.72, 1)  # walls, pith, core
    nt.links.new(ramp.outputs["Color"], mix.inputs["B"])  # pulp
    nt.links.new(m2.outputs[0], mix.inputs["Factor"])
    nt.links.new(mix.outputs["Result"], b.inputs["Base Color"])
    b.inputs["Roughness"].default_value = 0.18
    b.inputs["Subsurface Weight"].default_value = 0.6
    b.inputs["Subsurface Radius"].default_value = (0.5, 0.4, 0.1)
    b.inputs["Coat Weight"].default_value = 0.6
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.35
    nt.links.new(vor.outputs["Distance"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], b.inputs["Normal"])
    return m


def lemon(loc, rot):
    flesh = lemon_flesh()
    rind = mat("Rind", (0.95, 0.72, 0.05), 0.45, sss=0.2)
    pith = mat("Pith", (0.98, 0.95, 0.85), 0.6, sss=0.4)
    bpy.ops.mesh.primitive_cylinder_add(vertices=128, radius=1, depth=0.14, location=loc, rotation=rot)
    ob = bpy.context.object
    ob.data.materials.append(rind)
    ob.data.materials.append(flesh)
    for p in ob.data.polygons:
        p.material_index = 1 if abs(p.normal.z) > 0.9 else 0
    bev = ob.modifiers.new("b", "BEVEL")
    bev.width = 0.03
    bev.segments = 4
    bpy.ops.object.shade_smooth()
    # Thin pith band between rind and flesh.
    bpy.ops.mesh.primitive_torus_add(major_radius=0.93, minor_radius=0.075, location=loc, rotation=rot)
    t = bpy.context.object
    t.scale.z = 0.95
    t.data.materials.append(pith)
    bpy.ops.object.shade_smooth()
    return [ob, t]


def berries(loc, n=26, seed=4):
    rnd = random.Random(seed)
    skin = mat("Berry", (0.06, 0.01, 0.06), 0.18, coat=1.0)
    stem = mat("Stem", (0.22, 0.05, 0.1), 0.55)
    obs = []
    hub = Vector(loc) + Vector((0, 0, 0.45))
    for i in range(n):
        a = rnd.uniform(0, 2 * math.pi)
        r = math.sqrt(rnd.random()) * 0.85
        p = Vector(loc) + Vector((math.cos(a) * r * 0.75, math.sin(a) * r * 0.75, rnd.uniform(-0.06, 0.06) - r * r * 0.3))
        bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, radius=rnd.uniform(0.1, 0.13), location=p)
        b = bpy.context.object
        b.data.materials.append(skin)
        bpy.ops.object.shade_smooth()
        obs.append(b)
        # Stem from the berry to the hub.
        d = hub - p
        mid = p + d / 2
        bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.014, depth=d.length, location=mid)
        s = bpy.context.object
        s.rotation_euler = d.to_track_quat("Z", "Y").to_euler()
        s.data.materials.append(stem)
        obs.append(s)
    bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.03, depth=0.7, location=hub + Vector((0.07, 0, 0.32)), rotation=(0, math.radians(12), 0))
    main = bpy.context.object
    main.data.materials.append(stem)
    obs.append(main)
    return obs


def leaf(loc, rot, length=2.2):
    m = mat("Leaf", (0.07, 0.2, 0.04), 0.45, sss=0.25, coat=0.15)
    nt = m.node_tree
    wave = nt.nodes.new("ShaderNodeTexWave")
    wave.inputs["Scale"].default_value = 9
    wave.inputs["Distortion"].default_value = 2
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.15
    nt.links.new(wave.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], nt.nodes["Principled BSDF"].inputs["Normal"])
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, 0))
    ob = bpy.context.object
    ob.scale = (length, length * 0.42, 1)
    bpy.ops.object.transform_apply(scale=True)
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.subdivide(number_cuts=40)
    bpy.ops.object.mode_set(mode="OBJECT")
    for v in ob.data.vertices:
        x = v.co.x / length + 0.5  # 0..1 along the leaf
        w = math.sin(math.pi * min(max(x, 0), 1)) ** 0.8 * 0.5
        v.co.y = v.co.y / (length * 0.42) * 2 * w * length * 0.42
        # Midrib fold and a gentle bend along the length.
        v.co.z = abs(v.co.y) * 0.25 - (x - 0.5) ** 2 * 0.6
    ob.data.materials.append(m)
    ob.location = loc
    ob.rotation_euler = rot
    sol = ob.modifiers.new("s", "SOLIDIFY")
    sol.thickness = 0.012
    bpy.ops.object.shade_smooth()
    return [ob]


def studio(sc):
    world = bpy.data.worlds.new("W")
    sc.world = world
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.03, 0.06, 0.065, 1)
    for name, loc, size, strength, rot in [
        ("Key", (-4, -4, 4), (5, 5), 6, (math.radians(55), 0, math.radians(-45))),
        ("Rim", (4, 3, 2), (2, 6), 5, (math.radians(75), 0, math.radians(130))),
        ("Top", (0, 0, 7), (6, 6), 3, (0, 0, 0)),
    ]:
        bpy.ops.mesh.primitive_plane_add(size=1, location=loc, rotation=rot)
        p = bpy.context.object
        p.scale = (*size, 1)
        m = bpy.data.materials.new(name)
        nt = m.node_tree
        nt.nodes.remove(nt.nodes["Principled BSDF"])
        em = nt.nodes.new("ShaderNodeEmission")
        em.inputs["Strength"].default_value = strength
        nt.links.new(em.outputs[0], nt.nodes["Material Output"].inputs["Surface"])
        p.data.materials.append(m)
        p.visible_camera = False


def render(a, name, build, cam_loc, target):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.cycles.samples = a.samples
    sc.cycles.use_denoising = True
    sc.render.film_transparent = True
    sc.view_settings.view_transform = "Standard"
    sc.view_settings.exposure = -0.3
    sc.render.resolution_x = sc.render.resolution_y = a.size
    sc.render.image_settings.color_mode = "RGBA"
    studio(sc)
    build()
    cam = bpy.data.objects.new("Cam", bpy.data.cameras.new("Cam"))
    bpy.context.collection.objects.link(cam)
    cam.data.lens = 85
    cam.location = cam_loc
    cam.rotation_euler = (Vector(target) - Vector(cam_loc)).to_track_quat("-Z", "Y").to_euler()
    sc.camera = cam
    sc.render.filepath = f"{a.out}/{name}.png"
    bpy.ops.render.render(write_still=True)
    print("rendered", name, flush=True)


def main():
    a = args()
    render(a, "lemon-a", lambda: lemon((0, 0, 0), (math.radians(62), 0, math.radians(20))), (0, -9, 1.5), (0, 0, 0))
    render(a, "lemon-b", lambda: lemon((0, 0, 0), (math.radians(20), math.radians(10), 0)), (0, -9, 3.5), (0, 0, 0))
    render(a, "berries-a", lambda: berries((0, 0, 0)), (0, -5.5, 1.8), (0, 0, 0.05))
    render(a, "berries-b", lambda: berries((0, 0, 0), n=18, seed=9), (1.4, -5, 2.6), (0, 0, 0.05))
    render(a, "leaf-a", lambda: leaf((0, 0, 0), (math.radians(35), math.radians(10), math.radians(25))), (0, -9, 3), (0, 0, 0))
    render(a, "leaf-b", lambda: leaf((0, 0, 0), (math.radians(60), math.radians(-20), math.radians(-35)), 1.8), (0, -9, 2), (0, 0, 0))


main()
