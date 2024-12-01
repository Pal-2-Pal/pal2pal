import * as THREE from "three";
import PositionAlongPathState from "../utils/posAlogPath";
import { createClient } from "@supabase/supabase-js";
import { io, Socket } from "socket.io-client";

export const updatePosition = (
  curve: THREE.CatmullRomCurve3,
  object: THREE.Object3D,
  positionAlongPathState: PositionAlongPathState
) => {
  const timeElapsed = performance.now() - positionAlongPathState.lastScrollTime;

  if (timeElapsed < positionAlongPathState.movementDuration) {
    const timeLeftPercentage =
      timeElapsed / positionAlongPathState.movementDuration;

    const minimumDegreeOfChange = 0.005;
    const maximumDegreeOfChange = 0.9;

    let interpolationFactor = Math.max(
      timeLeftPercentage,
      minimumDegreeOfChange
    );
    interpolationFactor = Math.min(interpolationFactor, maximumDegreeOfChange);

    const interpolatedPositionOnPath =
      (1 - interpolationFactor) * positionAlongPathState.startingDistance +
      interpolationFactor * positionAlongPathState.targetDistance;

    positionAlongPathState.currentDistanceOnPath = interpolatedPositionOnPath;
    positionAlongPathState.currentPercentageOnPath =
      positionAlongPathState.currentDistanceOnPath < 0
        ? 1 - (Math.abs(positionAlongPathState.currentDistanceOnPath) % 1)
        : positionAlongPathState.currentDistanceOnPath % 1;

    if (typeof positionAlongPathState.currentPercentageOnPath === "undefined") {
      positionAlongPathState.currentPercentageOnPath = 0.001;
    }

    // Ensure lookAtPosition is within the valid range [0, 1]
    const lookAtPosition = Math.max(
      0,
      Math.min(1, positionAlongPathState.currentPercentageOnPath - 0.0000001)
    );

    const newPosition = curve.getPointAt(
      positionAlongPathState.currentPercentageOnPath
    );
    const newLookAt = curve.getPointAt(lookAtPosition);

    if (newPosition && newLookAt) {
      object.position.copy(newPosition);
      object.lookAt(newLookAt);
    }
  }
};

export function curveGen() {
  const radius = 5;
  const segments = 64;
  const points = [];

  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(
      new THREE.Vector3(0, radius * Math.cos(angle), radius * Math.sin(angle))
    );
  }
  points.push(points[0]);

  const curve = new THREE.CatmullRomCurve3(points, true);
  return curve;
}

export function createTextMesh(text: string) {
  const geometry = new THREE.PlaneGeometry(0.5, 0.5);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (context) {
    context.font = "48px Arial";
    context.fillStyle = "#000";
    context.fillText(text, 0, 50);
  }

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
  });
  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

export function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  let client: any;

  if (key && url) client = createClient(url, key);

  return client;
}

export function createSocket() {
  return io("http://localhost:4000/");
}
