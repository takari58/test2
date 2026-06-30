// ====== 新富町 複数スポット ======
const spots = [
    {
        name:"ファミマ",
        lat:37.95413, 
        lng:139.332375,
        radius:150,
    },
    {
        name: "新発田城跡",
        lat: 37.954824724542696,
        lng: 139.326001834219947,
        radius: 50,
        image:"castle.png"
    },
    {
        name: "清水園",
        lat: 37.943791,
        lng: 139.328785,
        radius: 50,
    },
    {
        name: "蔵春閣",
        lat: 37.94389807273562,
        lng: 139.3317142467578,
        radius: 10
    },
    {
        name: "東公園のSL",
        lat: 37.94367248807764,
        lng: 139.3323475293261,
        radius: 10,
    },
    {
        name: "諏訪神社",
        lat: 37.944214,
        lng: 139.332004,
        radius: 10,
    },
    {
        name: "新発田市役所",
        lat: 37.947839,
        lng: 139.327160,
        radius: 30,
    },
    {
        name: "王紋酒造",
        lat: 37.94436989072327,
        lng: 139.33066511399528,
        radius: 30,
    },
    {
        name: "五十公野公園",
        lat: 37.939869,
        lng: 139.356680,
        radius: 80,
    },
    {
        name: "カルチャーセンター",
        lat: 37.950246,
        lng: 139.338618,
        radius: 30,
    },
    {
        name: "新発田駅",
        lat: 37.94413,
        lng: 139.33510,
        radius: 30,
    },
    {
        name: "あやめの湯",
        lat: 37.953545,
        lng: 139.3549475,
        radius: 50,
    },
    {
        name: "イクネス",
        lat: 37.944357,
        lng: 139.333388,
        radius: 30,
    },
    {
        name: "市民文化会館",
        lat: 37.951722,
        lng:139.326564,
        radius: 30,
    },
    {
        name: "新発田歴史図書館",
        lat: 37.951279909157336,
        lng: 139.32774756292181,
        radius: 30,
    },
    /*
    {
        name: "元役所",
        lat: ,
        lng: ,
        radius: 30,
    },
    */
    {
        name: "新潟職能短大",
        lat: 37.956067,
        lng: 139.337938,
        radius:150,
    },
    {
        name: "菊水",
        lat: 37.960376479226,
        lng: 139.35429135822383,
        radius: 30,
    },
];

// ====== 地図初期化（中心を新富町に） ======
const map = L.map('map').setView([37.9555, 139.3400], 15);

// タイル
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

spots.forEach(spot => {

    const popupContent = `
        <div style="text-align:center;">
            <h3>${spot.name}</h3>
            <img src="${spot.image}" width="200"><br>
        </div>
    `;
    L.marker([spot.lat, spot.lng]).addTo(map)
        .bindPopup(popupContent);

    L.circle([spot.lat, spot.lng], {
        radius: spot.radius,
        color: 'red',
        fillOpacity: 0.2
    }).addTo(map);
});

// ====== 距離計算 ======
function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const toRad = x => x * Math.PI / 180;

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a = Math.sin(dLat/2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng/2) ** 2;

    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ====== 現在地取得 ======
let visitedSpots = new Set();

navigator.geolocation.watchPosition(position => {

    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;

const altitude = position.coords.altitude;
//取得できない場合は表示できない
const altitudeText = altitude !== null
    ?'${altitude}m'
    :"取得できません";

document.getElementById("coords").innerHTML = `
    緯度: ${userLat.toFixed(6)}<br>
    経度: ${userLng.toFixed(6)}<br>
    高度: ${altitudeText}
`;

    // 現在地マーカー更新
    if (window.userMarker) {
        map.removeLayer(window.userMarker);
    }
    window.userMarker = L.marker([userLat, userLng]).addTo(map)
        .bindPopup("現在地");

    let found = false;

    spots.forEach(spot => {
        const distance = getDistance(userLat, userLng, spot.lat, spot.lng);

        // 目的地到着
        if (!visitedSpots.has(spot.name) && distance <= spot.radius) {
            visitedSpots.add(spot.name);
            found = true;

            document.getElementById("result").innerHTML = `
                <b>${spot.name}に到達！</b><br>
                <a href="quiz.html?spot=${encodeURIComponent(spot.name)}">クイズへ</a>
            `;
        }
    });

    if (!found) {
        document.getElementById("result").innerHTML =
            "新発田市内を移動してください";
    }

}, () => {
    alert("位置情報が取得できません");
});
