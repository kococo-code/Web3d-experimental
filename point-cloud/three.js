
var scene, camera, renderer;

// I guess we need this stuff too
var container, HEIGHT,
    WIDTH, fieldOfView, aspectRatio,
    nearPlane, farPlane, stats,
    geometry, particleCount,
    i, h, color, size,
    materials = [],
    mouseX = 0,
    mouseY = 0,
    windowHalfX, windowHalfY, cameraZ,
    fogHex, fogDensity, parameters = {},
    parameterCount, particles;


window.addEventListener("load", () => {
    init();
    animate();
})


function init() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    windowHalfX = WIDTH / 2;
    windowHalfY = HEIGHT / 2;
    fieldOfView = 75;
    aspectRatio = WIDTH / HEIGHT;
    nearPlane = 1;
    farPlane = 3000;
    cameraZ = farPlane / 3;
    fogHex = 0x000000;
    fogDensity = 0.0007;
    camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
    camera.position.z = cameraZ;
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(fogHex, fogDensity);

    container = document.createElement('div');
    document.body.appendChild(container);
    document.body.style.margin = 0;
    document.body.style.overflow = 'hidden';

    geometry = new THREE.Geometry();
    particleCount = 20000;
    for (i = 0; i < particleCount; i++) {
        var vertex = new THREE.Vector3();
        vertex.x = Math.random() * 2000 - 1000;
        vertex.y = Math.random() * 2000 - 1000;
        vertex.z = Math.random() * 2000 - 1000;
        geometry.vertices.push(vertex);
    }

    parameters = [
        [
            [1, 1, 0.5], 5
        ],
        [
            [0.95, 1, 0.5], 4
        ],
        [
            [0.90, 1, 0.5], 3
        ],
        [
            [0.85, 1, 0.5], 2
        ],
        [
            [0.80, 1, 0.5], 1
        ]
    ];
    parameterCount = parameters.length;
    const sprite = new THREE.TextureLoader().load('./disc.png');
    for (i = 0; i < parameterCount; i++) {

        color = parameters[i][0];
        size = parameters[i][1];
        materials[i] = new THREE.PointsMaterial({ size: 5, sizeAttenuation: true, map: sprite, alphaTest: 0.5, transparent: true });

        particles = new THREE.PointCloud(geometry, materials[i]);

        particles.rotation.x = Math.random() * 6;
        particles.rotation.y = Math.random() * 6;
        particles.rotation.z = Math.random() * 6;

        scene.add(particles);
    }

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);

    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);

}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    var time = Date.now() * 0.00005;

    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;

    camera.lookAt(scene.position);

    for (i = 0; i < scene.children.length; i++) {
        var object = scene.children[i];
        object.rotation.y = time
    }

    for (i = 0; i < materials.length; i++) {
        color = parameters[i][0];
        h = (360 * (color[0] + time) % 360) / 360;
        materials[i].color.setHSL(h, color[1], color[2]);
    }
    renderer.render(scene, camera);
}

function onDocumentMouseMove(e) {
    mouseX = e.clientX - windowHalfX;
    mouseY = e.clientY - windowHalfY;
}


function onDocumentTouchStart(e) {

    if (e.touches.length === 1) {

        e.preventDefault();
        mouseX = e.touches[0].pageX - windowHalfX;
        mouseY = e.touches[0].pageY - windowHalfY;
    }
}

function onDocumentTouchMove(e) {

    if (e.touches.length === 1) {

        e.preventDefault();
        mouseX = e.touches[0].pageX - windowHalfX;
        mouseY = e.touches[0].pageY - windowHalfY;
    }
}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
