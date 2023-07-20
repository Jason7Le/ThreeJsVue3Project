// 工具集
export function addBottomGrid (THREE){
    // /添加一个底座平面
    // 平面几何
    const planeGeometry = new THREE.PlaneGeometry( 2000, 2000 );

    // 把xy平面变为xZ平面
    planeGeometry.rotateX( - Math.PI / 2 );

    //纹理贴图加载器TextureLoader
    const grassland = new THREE.TextureLoader().load('./image/cd.jpg')
    // 基础网格材质
    const planeMaterial = new THREE.MeshBasicMaterial({
        // map: grassland
    });

    // 把平面几何和基础网格材质 生成平面网格
    const plane = new THREE.Mesh( planeGeometry, planeMaterial );

    // 平面网格向下（y轴负方向）移动200单位
    plane.position.y = -200;

    // 把平面添加到场景里面
    // scene.add( plane );

    // 网格辅助器
    // 创建一个网格辅助器的实例，传入参数 坐标格尺寸、坐标格细分次数
    const helper = new THREE.GridHelper( 2000, 100 ); 

    // 向下（y轴负方向）移动199单位，与底座平面几乎重合
    helper.position.y = - 199;

    // 透明度
    helper.material.opacity = 0.25;

    // 是否可透明
    helper.material.transparent = true;

    // 添加到场景
    // scene.add( helper );
    return {
        plane,
        helper
    };
}