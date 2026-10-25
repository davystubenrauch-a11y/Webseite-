"""
Cinematic renders of the SPIRULI can with Blender Cycles, built on the can
and studio from render_can.py and the props from render_props.py.

  python render_scenes.py -- --label L.png --pbr P.png --out DIR --mode MODE [options]

Modes:
  video    seamless loop: the can makes half a turn (the artwork repeats on
           the back) on a dark studio set with a reflective floor; frames
           video-NNNN.png
           (--frames, --first, --last)
  macro    three close-ups with shallow depth of field: macro-word.png,
           macro-seal.png, macro-band.png
  packshot wide studio shot, can on the right (packshot.png)
  flatlay  top-down packshot: the can lying on slate with lemon slices,
           elderberries and leaves (flatlay.png)
"""
import argparse
import math
import os
import sys

import bpy  # noqa: I001  (bpy must be imported before mathutils)
from mathutils import Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import render_can as rc  # noqa: E402
import render_props as rp  # noqa: E402


def args():
    p = argparse.ArgumentParser()
    p.add_argument("--label", required=True)
    p.add_argument("--pbr", required=True)
    p.add_argument("--out", required=True)
    p.add_argument("--mode", required=True)
    p.add_argument("--size", default="1600x900")
    p.add_argument("--samples", type=int, default=32)
    p.add_argument("--frames", type=int, default=192)
    p.add_argument("--first", type=int, default=0)
    p.add_argument("--last", type=int, default=-1)
    a = p.parse_args(sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else [])
    a.mode_can = a.mode
    return a


def aim(cam, target):
    cam.rotation_euler = (Vector(target) - cam.location).to_track_quat("-Z", "Y").to_euler()


def condensation(strength=1.0):
    """Cold-can droplets on the lacquer: Voronoi beads in the clear coat, thinned out by noise."""
    m = bpy.data.materials["Label"]
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]
    tc = nt.nodes.new("ShaderNodeTexCoord")
    vor = nt.nodes.new("ShaderNodeTexVoronoi")
    vor.inputs["Scale"].default_value = 70
    vor.inputs["Randomness"].default_value = 1
    nt.links.new(tc.outputs["Object"], vor.inputs["Vector"])
    # Round bead profile from the distance to the cell centre.
    bead = nt.nodes.new("ShaderNodeMapRange")
    bead.inputs["From Min"].default_value = 0.38
    bead.inputs["From Max"].default_value = 0.0
    nt.links.new(vor.outputs["Distance"], bead.inputs["Value"])
    pw = nt.nodes.new("ShaderNodeMath")
    pw.operation = "SQRT"
    nt.links.new(bead.outputs[0], pw.inputs[0])
    # Patchy coverage, denser toward the bottom.
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 6
    nt.links.new(tc.outputs["Object"], noise.inputs["Vector"])
    mask = nt.nodes.new("ShaderNodeMapRange")
    mask.inputs["From Min"].default_value = 0.45
    mask.inputs["From Max"].default_value = 0.6
    nt.links.new(noise.outputs["Fac"], mask.inputs["Value"])
    mul = nt.nodes.new("ShaderNodeMath")
    mul.operation = "MULTIPLY"
    nt.links.new(pw.outputs[0], mul.inputs[0])
    nt.links.new(mask.outputs[0], mul.inputs[1])
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.6 * strength
    bump.inputs["Distance"].default_value = 0.02
    nt.links.new(mul.outputs[0], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], b.inputs["Coat Normal"])
    # Water reads glossy where the beads are.
    coat = nt.nodes.new("ShaderNodeMapRange")
    coat.inputs["To Min"].default_value = 0.12
    coat.inputs["To Max"].default_value = 0.9
    nt.links.new(mask.outputs[0], coat.inputs["Value"])
    nt.links.new(coat.outputs[0], b.inputs["Coat Weight"])
    b.inputs["Coat Roughness"].default_value = 0.06


def studio_set(color=(0.02, 0.07, 0.075)):
    """Glossy petrol floor that fades into a plain world of the same colour,
    so the set has no visible horizon and the video blends into the page."""
    ground = next(o for o in bpy.data.objects if getattr(o, "is_shadow_catcher", False))
    bpy.data.objects.remove(ground)
    floor_z = -rc.TOP - 0.097
    for name in ("Key", "StripL", "StripR", "Fill"):
        bpy.data.objects[name].location.z += 2.4
    world = bpy.context.scene.world
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (*color, 1)
    bpy.ops.mesh.primitive_plane_add(size=80, location=(0, 0, floor_z))
    floor = bpy.context.object
    m = bpy.data.materials.new("Set")
    nt = m.node_tree
    out = nt.nodes["Material Output"]
    b = nt.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = 0.22
    # Fade to the world colour with distance from the can.
    tc = nt.nodes.new("ShaderNodeTexCoord")
    dist = nt.nodes.new("ShaderNodeVectorMath")
    dist.operation = "LENGTH"
    nt.links.new(tc.outputs["Object"], dist.inputs[0])
    fade = nt.nodes.new("ShaderNodeMapRange")
    fade.inputs["From Min"].default_value = 2.5
    fade.inputs["From Max"].default_value = 9
    nt.links.new(dist.outputs["Value"], fade.inputs["Value"])
    bg = nt.nodes.new("ShaderNodeEmission")
    bg.inputs["Color"].default_value = (*color, 1)
    mix = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(fade.outputs[0], mix.inputs["Fac"])
    nt.links.new(b.outputs["BSDF"], mix.inputs[1])
    nt.links.new(bg.outputs["Emission"], mix.inputs[2])
    nt.links.new(mix.outputs["Shader"], out.inputs["Surface"])
    floor.data.materials.append(m)


def video(a, sc, can, cam):
    studio_set()
    sc.render.film_transparent = False
    cam.data.lens = 50
    cam.location = (0, -10.5, 0.55)
    aim(cam, (0, 0, 0.05))
    cam.data.dof.use_dof = True
    cam.data.dof.focus_distance = 10.5
    cam.data.dof.aperture_fstop = 4
    n = a.frames
    last = n - 1 if a.last < 0 else a.last
    for i in range(a.first, last + 1):
        t = i / n
        # The design repeats on the back, so half a turn already loops seamlessly.
        can.rotation_euler = (0, 0, -math.pi * t)
        can.location.z = math.sin(2 * math.pi * t) * 0.03
        sc.render.filepath = f"{a.out}/video-{i:04d}.png"
        bpy.ops.render.render(write_still=True)
        print("frame", i, flush=True)


def macro(a, sc, can, cam):
    studio_set()
    sc.render.film_transparent = False
    cam.data.dof.use_dof = True
    cam.data.dof.aperture_fstop = 2.2
    shots = [
        ("word", 0.18, (0.35, -2.4, 0.5), (0.0, 0, 0.35)),
        ("seal", -0.6, (0.6, -2.0, 1.15), (0.25, 0, 1.0)),
        ("band", 0.0, (0.0, -2.2, -0.9), (0.0, 0, -1.05)),
    ]
    for name, rot, loc, target in shots:
        can.rotation_euler = (0, 0, rot)
        cam.location = loc
        aim(cam, target)
        cam.data.lens = 60
        cam.data.dof.focus_distance = (Vector(target) - Vector(loc)).length * 0.92
        sc.render.filepath = f"{a.out}/macro-{name}.png"
        bpy.ops.render.render(write_still=True)
        print("macro", name, flush=True)


def slate():
    """Grey-green slate slab with soft veins, like the product photo."""
    floor_z = -rc.R
    bpy.ops.mesh.primitive_plane_add(size=30, location=(0, 0, floor_z))
    s = bpy.context.object
    m = bpy.data.materials.new("Slate")
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]
    tc = nt.nodes.new("ShaderNodeTexCoord")
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 0.35
    noise.inputs["Detail"].default_value = 12
    noise.inputs["Roughness"].default_value = 0.6
    nt.links.new(tc.outputs["Object"], noise.inputs["Vector"])
    wave = nt.nodes.new("ShaderNodeTexWave")
    wave.inputs["Scale"].default_value = 0.25
    wave.inputs["Distortion"].default_value = 9
    wave.inputs["Detail"].default_value = 6
    nt.links.new(tc.outputs["Object"], wave.inputs["Vector"])
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = (0.16, 0.22, 0.22, 1)
    ramp.color_ramp.elements[1].color = (0.42, 0.47, 0.45, 1)
    nt.links.new(noise.outputs["Fac"], ramp.inputs["Fac"])
    veins = nt.nodes.new("ShaderNodeMix")
    veins.data_type = "RGBA"
    veins.blend_type = "OVERLAY"
    veins.inputs["Factor"].default_value = 0.35
    nt.links.new(ramp.outputs["Color"], veins.inputs["A"])
    nt.links.new(wave.outputs["Color"], veins.inputs["B"])
    nt.links.new(veins.outputs["Result"], b.inputs["Base Color"])
    b.inputs["Roughness"].default_value = 0.55
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.08
    nt.links.new(noise.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], b.inputs["Normal"])
    s.data.materials.append(m)
    return floor_z


def flatlay(a, sc, can, cam):
    ground = next(o for o in bpy.data.objects if getattr(o, "is_shadow_catcher", False))
    bpy.data.objects.remove(ground)
    floor_z = slate()
    sc.render.film_transparent = False
    # Lay the can on its side, label facing up, slightly diagonal.
    can.rotation_euler = (math.radians(90), 0, math.radians(-8))
    can.location = (0, 0, 0)
    # Props around it, on the stone.
    for ob in rp.lemon((2.35, 1.6, floor_z + 0.07), (0, 0, 0.4)):
        ob.scale = (0.7, 0.7, 0.7)
    for ob in rp.lemon((2.6, -1.0, floor_z + 0.07), (0, math.radians(8), 1.2)):
        ob.scale = (0.6, 0.6, 0.6)
    for ob in rp.berries((2.1, 0.35, floor_z + 0.25), n=22, seed=3):
        pass
    for ob in rp.berries((-2.3, 1.7, floor_z + 0.25), n=14, seed=8):
        pass
    for ob in rp.leaf((-2.4, -1.3, floor_z + 0.05), (0, 0, math.radians(40)), 1.6):
        pass
    for ob in rp.leaf((-1.9, -1.8, floor_z + 0.05), (0, 0, math.radians(-20)), 1.3):
        pass
    cam.data.lens = 50
    cam.location = (0.2, -0.3, 11.5)
    aim(cam, (0.2, 0, floor_z))
    sc.render.filepath = f"{a.out}/flatlay.png"
    bpy.ops.render.render(write_still=True)
    print("flatlay", flush=True)


def packshot(a, sc, can, cam):
    """Wide studio shot: the can large on the right, room for text on the left."""
    studio_set()
    sc.render.film_transparent = False
    can.rotation_euler = (0, 0, math.radians(-25))
    can.location = (1.9, 0, 0)
    cam.data.lens = 55
    cam.location = (0.2, -11.5, 0.1)
    aim(cam, (0.2, 0, 0.0))
    cam.data.dof.use_dof = True
    cam.data.dof.focus_distance = 11.6
    cam.data.dof.aperture_fstop = 2.8
    sc.render.filepath = f"{a.out}/packshot.png"
    bpy.ops.render.render(write_still=True)
    print("packshot", flush=True)


def main():
    a = args()
    sc, can, cam = rc.scene(a)
    sc.view_settings.exposure = -0.45
    {"video": video, "macro": macro, "flatlay": flatlay, "packshot": packshot}[a.mode](a, sc, can, cam)


main()
