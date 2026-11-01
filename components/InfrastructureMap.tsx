'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import WidgetFooter from './WidgetFooter';

// Fix for default marker icons in Leaflet when used with Webpack/Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Red Icon for Danger level IV bridges
const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const BRIDGES = [
    // --- 東京都 (4件) ---
    { name: '福重橋', lat: 34.7743, lng: 139.42849, year: 1939, loc: '東京都大島町', status: 'IV', memo: '措置未着手' },
    { name: '万立橋（場所打ち部）', lat: 34.78361, lng: 139.35119, year: '不明', loc: '東京都大島町', status: 'IV', memo: '措置未着手' },
    { name: '網代橋', lat: 35.72401, lng: 139.25371, year: 1933, loc: '東京都あきる野市', status: 'IV', memo: '措置未着手' },
    { name: '下中里橋', lat: 35.74, lng: 139.13889, year: '不明', loc: '東京都檜原村', status: 'IV', memo: '措置未着手' },
    // --- 埼玉県 (21件) ---
    { name: '鬼澤橋', lat: 35.81367, lng: 139.69893, year: 1958, loc: '埼玉県川口市', status: 'IV', memo: '措置未着手' },
    { name: '第２５号橋', lat: 35.95209, lng: 139.50336, year: '不明', loc: '埼玉県川越市', status: 'IV', memo: '措置未着手' },
    { name: '新畑沢第３橋', lat: 36.06637, lng: 139.1867, year: '不明', loc: '埼玉県東秩父村', status: 'IV', memo: '措置未着手' },
    { name: '2272号線1号橋', lat: 36.11439, lng: 139.52187, year: '不明', loc: '埼玉県鴻巣市', status: 'IV', memo: '措置未着手' },
    { name: '9-27号橋', lat: 36.11457, lng: 139.46961, year: 1933, loc: '埼玉県行田市', status: 'IV', memo: '措置未着手' },
    { name: '加_6048号橋', lat: 36.11464, lng: 139.62239, year: '不明', loc: '埼玉県加須市', status: 'IV', memo: '措置未着手' },
    { name: '2249号線1号橋', lat: 36.1188, lng: 139.51854, year: '不明', loc: '埼玉県鴻巣市', status: 'IV', memo: '措置未着手' },
    { name: '森の前２号橋', lat: 36.13528, lng: 139.07278, year: '不明', loc: '埼玉県本庄市', status: 'IV', memo: '措置未着手' },
    { name: '沢向橋', lat: 36.13556, lng: 139.07361, year: 1969, loc: '埼玉県本庄市', status: 'IV', memo: '措置未着手' },
    { name: '7-30号橋', lat: 36.13873, lng: 139.46977, year: '不明', loc: '埼玉県行田市', status: 'IV', memo: '措置未着手' },
    { name: '大_130号橋', lat: 36.13892, lng: 139.68375, year: '不明', loc: '埼玉県加須市', status: 'IV', memo: '措置未着手' },
    { name: '日影３号橋', lat: 36.13917, lng: 139.0675, year: '不明', loc: '埼玉県本庄市', status: 'IV', memo: '措置未着手' },
    { name: '大_六軒橋', lat: 36.14126, lng: 139.6836, year: '不明', loc: '埼玉県加須市', status: 'IV', memo: '措置未着手' },
    { name: '畝杉１号橋', lat: 36.14167, lng: 139.07861, year: '不明', loc: '埼玉県本庄市', status: 'IV', memo: '措置未着手' },
    { name: '大利根112号橋', lat: 36.14278, lng: 139.67253, year: '不明', loc: '埼玉県加須市', status: 'IV', memo: '措置未着手' },
    { name: '加_4018号橋', lat: 36.15076, lng: 139.62743, year: 1940, loc: '埼玉県加須市', status: 'IV', memo: '措置未着手' },
    { name: '5-21号橋', lat: 36.15584, lng: 139.46518, year: '不明', loc: '埼玉県行田市', status: 'IV', memo: '措置未着手' },
    { name: '前耕地２号橋', lat: 36.16056, lng: 139.08056, year: '不明', loc: '埼玉県本庄市', status: 'IV', memo: '措置未着手' },
    { name: '前耕地１号橋', lat: 36.16056, lng: 139.08139, year: '不明', loc: '埼玉県本庄市', status: 'IV', memo: '措置未着手' },
    { name: '川向１号橋', lat: 36.16083, lng: 139.08639, year: '不明', loc: '埼玉県本庄市', status: 'IV', memo: '措置未着手' },
    { name: '3-9号橋', lat: 36.16124, lng: 139.46304, year: '不明', loc: '埼玉県行田市', status: 'IV', memo: '措置未着手' },
    // --- 千葉県 (7件) ---
    { name: '大半津橋', lat: 35.03552, lng: 139.84859, year: 2001, loc: '千葉県南房総市', status: 'IV', memo: '措置未着手' },
    { name: '追原橋', lat: 35.20109, lng: 140.13966, year: 1971, loc: '千葉県君津市', status: 'IV', memo: '措置未着手' },
    { name: '長浦橋', lat: 35.20757, lng: 140.0385, year: 1955, loc: '千葉県君津市', status: 'IV', memo: '措置未着手' },
    { name: '正木１号橋', lat: 35.2205, lng: 140.02486, year: 1932, loc: '千葉県君津市', status: 'IV', memo: '措置未着手' },
    { name: '名殿跨線橋', lat: 35.24867, lng: 140.07733, year: 1936, loc: '千葉県君津市', status: 'IV', memo: '措置未着手' },
    { name: '泉橋', lat: 35.30306, lng: 139.94405, year: 1970, loc: '千葉県君津市', status: 'IV', memo: '措置未着手' },
    { name: '川端橋', lat: 35.50293, lng: 140.07834, year: 1957, loc: '千葉県市原市', status: 'IV', memo: '措置未着手' },
    // --- 神奈川県 (1件) ---
    { name: '無名橋（津久井18）', lat: 35.55969, lng: 139.20589, year: 1960, loc: '神奈川県相模原市', status: 'IV', memo: '措置未着手' },
];

export default function InfrastructureMap() {
    const currentYear = new Date().getFullYear();

    return (
        <div className="widget" style={{ padding: '1rem 1.25rem', height: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                    <h2 className="widget-title" style={{ margin: 0, fontSize: '1.05rem' }}>
                        🚨 老朽化橋梁マップ（首都圏・判定区分IV抜粋）
                    </h2>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                        全国約73万橋のうち建設後50年超が2033年に約63%へ急増（修繕費・技術者不足で措置未着手が多数）
                    </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-red)', fontWeight: 800, background: 'rgba(239, 68, 68, 0.1)', padding: '3px 9px', borderRadius: '999px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                    判定IV（緊急措置段階・未着手）
                </div>
            </div>

            <div style={{ flex: 1, position: 'relative', borderRadius: '12px', overflow: 'hidden', marginTop: '0.6rem' }}>
                <MapContainer center={[35.8617, 139.6455]} zoom={8} scrollWheelZoom={false} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {BRIDGES.map((bridge, idx) => {
                        const ageStr = bridge.year !== '不明' ? `築${currentYear - Number(bridge.year)}年` : '築年数不明';
                        return (
                            <Marker key={idx} position={[bridge.lat, bridge.lng]} icon={redIcon}>
                                <Popup>
                                    <div style={{ fontFamily: 'var(--font-sans)', minWidth: '200px' }}>
                                        <strong style={{ display: 'block', fontSize: '1.05rem', borderBottom: '1px solid #eee', paddingBottom: '4px', marginBottom: '6px' }}>
                                            {bridge.name}
                                        </strong>
                                        <span style={{ background: 'var(--accent-red)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 'bold' }}>
                                            判定IV (緊急措置段階)
                                        </span>
                                        <div style={{ marginTop: '6px', fontSize: '0.82rem', lineHeight: 1.5 }}>
                                            <b>場所:</b> {bridge.loc}
                                            <br />
                                            <b>完成:</b> {bridge.year}年 ({ageStr})
                                            <br />
                                            <b>状況:</b> {bridge.memo}
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>

            <WidgetFooter
                sourceName="国土交通省「道路メンテナンス年報（橋梁定期点検・判定区分IV）」"
                sourceUrl="https://www.mlit.go.jp/road/sisaku/yobohozen/yobohozen.html"
                shareText="【インフラ老朽化の現実】高度経済成長期に一斉建設された橋梁・トンネルの老朽化が限界に。首都圏だけでも緊急措置段階（判定IV）のまま修繕未着手の橋が多数存在します。"
            />
        </div>
    );
}
