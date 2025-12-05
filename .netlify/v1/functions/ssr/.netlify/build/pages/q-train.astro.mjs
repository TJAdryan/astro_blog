/* empty css                                 */
import { c as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from "../chunks/astro/server_C7Z9Vbd7.mjs";
import "kleur/colors";
import { $ as $$BaseLayout } from "../chunks/BaseLayout__fXPCThu.mjs";
import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { renderers } from "../renderers.mjs";
const L06 = "1 Av";
const F14 = "2 Av";
const L05 = "3 Av";
const F23 = "4 Av";
const F12 = "5 Av/53 St";
const R13 = "5 Av/59 St";
const L02 = "6 Av";
const F24 = "7 Av";
const D14 = "7 Av";
const D25 = "7 Av";
const L01 = "8 Av";
const N02 = "8 Av";
const R21 = "8 St - NYU";
const B12 = "9 Av";
const R33 = "9 St";
const R20 = "14 St - Union Sq";
const L03 = "14 St - Union Sq";
const D19 = "14 St";
const A31 = "14 St";
const F25 = "15 St - Prospect Park";
const N05 = "18 Av";
const F30 = "18 Av";
const B19 = "18 Av";
const N06 = "20 Av";
const B20 = "20 Av";
const G24 = "21 St";
const B04 = "21 St - Queensbridge";
const D18 = "23 St";
const A30 = "23 St";
const R19 = "23 St";
const B22 = "25 Av";
const R35 = "25 St";
const R18 = "28 St";
const R04 = "30 Av";
const D17 = "34 St - Herald Sq";
const R17 = "34 St - Herald Sq";
const A28 = "34 St - Penn Station";
const R06 = "36 Av";
const R36 = "36 St";
const G20 = "36 St";
const R08 = "39 Av";
const D16 = "42 St - Bryant Pk";
const A27 = "42 St - Port Authority Bus Terminal";
const R39 = "45 St";
const G18 = "46 St";
const D15 = "47-50 Sts - Rockefeller Ctr";
const R15 = "49 St";
const A25 = "50 St";
const B14 = "50 St";
const R40 = "53 St";
const B15 = "55 St";
const B10 = "57 St";
const R14 = "57 St - 7 Av";
const A24 = "59 St - Columbus Circle";
const R41 = "59 St";
const B16 = "62 St";
const G10 = "63 Dr - Rego Park";
const G15 = "65 St";
const G09 = "67 Av";
const B17 = "71 St";
const Q03 = "72 St";
const A22 = "72 St";
const F07 = "75 Av";
const J17 = "75 St - Elderts Ln";
const R43 = "77 St";
const B18 = "79 St";
const A59 = "80 St";
const A21 = "81 St - Museum of Natural History";
const J16 = "85 St - Forest Pkwy";
const Q04 = "86 St";
const R44 = "86 St";
const A20 = "86 St";
const N10 = "86 St";
const A60 = "88 St";
const Q05 = "96 St";
const A19 = "96 St";
const A18 = "103 St";
const J14 = "104 St";
const A63 = "104 St";
const J13 = "111 St";
const A64 = "111 St";
const A16 = "116 St";
const J12 = "121 St";
const A15 = "125 St";
const A14 = "135 St";
const D13 = "145 St";
const A12 = "145 St";
const D12 = "155 St";
const A11 = "155 St";
const D11 = "161 St - Yankee Stadium";
const A10 = "163 St - Amsterdam Av";
const D10 = "167 St";
const A09 = "168 St";
const F02 = "169 St";
const D09 = "170 St";
const D08 = "174-175 Sts";
const A07 = "175 St";
const A06 = "181 St";
const D06 = "182-183 Sts";
const A05 = "190 St";
const J24 = "Alabama Av";
const S17 = "Annadale";
const H02 = "Aqueduct - N Conduit Av";
const H01 = "Aqueduct Racetrack";
const S11 = "Arthur Kill";
const R03 = "Astoria Blvd";
const R01 = "Astoria - Ditmars Blvd";
const L24 = "Atlantic Av";
const R31 = "Atlantic Av - Barclays Ctr";
const D24 = "Atlantic Av - Barclays Ctr";
const D32 = "Avenue H";
const F31 = "Avenue I";
const D33 = "Avenue J";
const D34 = "Avenue M";
const F33 = "Avenue N";
const F34 = "Avenue P";
const D37 = "Avenue U";
const F36 = "Avenue U";
const N09 = "Avenue U";
const F38 = "Avenue X";
const B23 = "Bay 50 St";
const B21 = "Bay Pkwy";
const N07 = "Bay Pkwy";
const F32 = "Bay Pkwy";
const R45 = "Bay Ridge - 95 St";
const R42 = "Bay Ridge Av";
const S20 = "Bay Terrace";
const H10 = "Beach 25 St";
const H09 = "Beach 36 St";
const H08 = "Beach 44 St";
const H07 = "Beach 60 St";
const H06 = "Beach 67 St";
const H12 = "Beach 90 St";
const H13 = "Beach 98 St";
const H14 = "Beach 105 St";
const L08 = "Bedford Av";
const G33 = "Bedford - Nostrand Avs";
const D03 = "Bedford Park Blvd";
const F20 = "Bergen St";
const D29 = "Beverley Rd";
const S04 = "Botanic Garden";
const M19 = "Bowery";
const F05 = "Briarwood - Van Wyck Blvd";
const D40 = "Brighton Beach";
const H04 = "Broad Channel";
const M23 = "Broad St";
const L22 = "Broadway Jct";
const A51 = "Broadway Jct";
const J27 = "Broadway Jct";
const D21 = "Broadway-Lafayette St";
const R05 = "Broadway";
const G30 = "Broadway";
const L21 = "Bushwick Av - Aberdeen St";
const A34 = "Canal St";
const Q01 = "Canal St";
const R23 = "Canal St";
const M20 = "Canal St";
const L29 = "Canarsie - Rockaway Pkwy";
const F21 = "Carroll St";
const A17 = "Cathedral Pkwy (110 St)";
const M10 = "Central Av";
const M21 = "Chambers St";
const A36 = "Chambers St";
const J28 = "Chauncey St";
const D28 = "Church Av";
const F27 = "Church Av";
const R24 = "City Hall";
const G34 = "Classon Av";
const J22 = "Cleveland St";
const S28 = "Clifton";
const A44 = "Clinton - Washington Avs";
const G35 = "Clinton - Washington Avs";
const D43 = "Coney Island - Stillwell Av";
const D30 = "Cortelyou Rd";
const R25 = "Cortlandt St";
const F09 = "Court Sq - 23 St";
const G22 = "Court Sq";
const R28 = "Court St";
const J20 = "Crescent St";
const J19 = "Cypress Hills";
const R30 = "DeKalb Av";
const L16 = "DeKalb Av";
const F15 = "Delancey St";
const F29 = "Ditmas Av";
const S25 = "Dongan Hills";
const A03 = "Dyckman St";
const L28 = "E 105 St";
const F16 = "East Broadway";
const G13 = "Elmhurst Av";
const S18 = "Eltingville";
const M18 = "Essex St";
const A55 = "Euclid Av";
const H11 = "Far Rockaway - Mott Av";
const M12 = "Flushing Av";
const G31 = "Flushing Av";
const D05 = "Fordham Rd";
const M05 = "Forest Av";
const G08 = "Forest Hills - 71 Av";
const N03 = "Fort Hamilton Pkwy";
const B13 = "Fort Hamilton Pkwy";
const F26 = "Fort Hamilton Pkwy";
const A45 = "Franklin Av";
const S01 = "Franklin Av";
const M04 = "Fresh Pond Rd";
const A38 = "Fulton St";
const M22 = "Fulton St";
const G36 = "Fulton St";
const J30 = "Gates Av";
const L11 = "Graham Av";
const G12 = "Grand Av - Newtown";
const L12 = "Grand St";
const D22 = "Grand St";
const A57 = "Grant Av";
const S23 = "Grant City";
const S27 = "Grasmere";
const S19 = "Great Kills";
const G26 = "Greenpoint Av";
const J29 = "Halsey St";
const L19 = "Halsey St";
const M14 = "Hewes St";
const A40 = "High St";
const H03 = "Howard Beach - JFK Airport";
const A42 = "Hoyt - Schermerhorn Sts";
const S16 = "Huguenot";
const A02 = "Inwood - 207 St";
const G14 = "Jackson Hts - Roosevelt Av";
const F01 = "Jamaica - 179 St";
const G05 = "Jamaica Center - Parsons/Archer";
const G07 = "Jamaica - Van Wyck";
const R29 = "Jay St - MetroTech";
const A41 = "Jay St - MetroTech";
const S24 = "Jefferson Av";
const L15 = "Jefferson St";
const F06 = "Kew Gardens - Union Tpke";
const D35 = "Kings Hwy";
const F35 = "Kings Hwy";
const N08 = "Kings Hwy";
const D04 = "Kingsbridge Rd";
const A47 = "Kingston - Throop Avs";
const M09 = "Knickerbocker Av";
const J31 = "Kosciuszko St";
const A43 = "Lafayette Av";
const F11 = "Lexington Av/53 St";
const R11 = "Lexington Av/59 St";
const B08 = "Lexington Av/63 St";
const A52 = "Liberty Av";
const L26 = "Livonia Av";
const M13 = "Lorimer St";
const L10 = "Lorimer St";
const M16 = "Marcy Av";
const G29 = "Metropolitan Av";
const M01 = "Middle Village - Metropolitan Av";
const L13 = "Montrose Av";
const L14 = "Morgan Av";
const M11 = "Myrtle Av";
const G32 = "Myrtle - Willoughby Avs";
const L17 = "Myrtle - Wyckoff Avs";
const M08 = "Myrtle - Wyckoff Avs";
const G28 = "Nassau Av";
const D38 = "Neck Rd";
const F39 = "Neptune Av";
const S22 = "New Dorp";
const L27 = "New Lots Av";
const N04 = "New Utrecht Av";
const D31 = "Newkirk Plaza";
const G16 = "Northern Blvd";
const D01 = "Norwood - 205 St";
const J21 = "Norwood Av";
const A46 = "Nostrand Av";
const S21 = "Oakwood Heights";
const D41 = "Ocean Pkwy";
const S26 = "Old Town";
const A65 = "Ozone Park - Lefferts Blvd";
const S03 = "Park Pl";
const D27 = "Parkside Av";
const F03 = "Parsons Blvd";
const S14 = "Pleasant Plains";
const R22 = "Prince St";
const S15 = "Prince's Bay";
const R34 = "Prospect Av";
const D26 = "Prospect Park";
const G21 = "Queens Plaza";
const R09 = "Queensboro Plaza";
const A49 = "Ralph Av";
const R26 = "Rector St";
const S13 = "Richmond Valley";
const A50 = "Rockaway Av";
const A61 = "Rockaway Blvd";
const H15 = "Rockaway Park - Beach 116 St";
const B06 = "Roosevelt Island";
const M06 = "Seneca Av";
const D39 = "Sheepshead Bay";
const A54 = "Shepherd Av";
const F22 = "Smith - 9 Sts";
const A33 = "Spring St";
const S31 = "St George";
const S29 = "Stapleton";
const G19 = "Steinway St";
const F04 = "Sutphin Blvd";
const G06 = "Sutphin Blvd - Archer Av - JFK Airport";
const L25 = "Sutter Av";
const R16 = "Times Sq - 42 St";
const S30 = "Tompkinsville";
const S09 = "Tottenville";
const D07 = "Tremont Av";
const R32 = "Union St";
const A48 = "Utica Av";
const J23 = "Van Siclen Av";
const A53 = "Van Siclen Av";
const D20 = "W 4 St - Washington Sq";
const A32 = "W 4 St - Washington Sq";
const D42 = "W 8 St - NY Aquarium";
const R27 = "Whitehall St - South Ferry";
const L20 = "Wilson Av";
const J15 = "Woodhaven Blvd";
const G11 = "Woodhaven Blvd";
const E01 = "World Trade Center";
const F18 = "York St";
const stationMap = {
  "101": "Van Cortlandt Park - 242 St",
  "103": "238 St",
  "104": "231 St",
  "106": "Marble Hill - 225 St",
  "107": "215 St",
  "108": "207 St",
  "109": "Dyckman St",
  "110": "191 St",
  "111": "181 St",
  "112": "168 St - Washington Hts",
  "113": "157 St",
  "114": "145 St",
  "115": "137 St - City College",
  "116": "125 St",
  "117": "116 St - Columbia University",
  "118": "Cathedral Pkwy (110 St)",
  "119": "103 St",
  "120": "96 St",
  "121": "86 St",
  "122": "79 St",
  "123": "72 St",
  "124": "66 St - Lincoln Center",
  "125": "59 St - Columbus Circle",
  "126": "50 St",
  "127": "Times Sq - 42 St",
  "128": "34 St - Penn Station",
  "129": "28 St",
  "130": "23 St",
  "131": "18 St",
  "132": "14 St",
  "133": "Christopher St - Stonewall",
  "134": "Houston St",
  "135": "Canal St",
  "136": "Franklin St",
  "137": "Chambers St",
  "138": "WTC Cortlandt",
  "139": "Rector St",
  "142": "South Ferry",
  "201": "Wakefield - 241 St",
  "204": "Nereid Av",
  "205": "233 St",
  "206": "225 St",
  "207": "219 St",
  "208": "Gun Hill Rd",
  "209": "Burke Av",
  "210": "Allerton Av",
  "211": "Pelham Pkwy",
  "212": "Bronx Park East",
  "213": "E 180 St",
  "214": "West Farms Sq - E Tremont Av",
  "215": "174 St",
  "216": "Freeman St",
  "217": "Simpson St",
  "218": "Intervale Av",
  "219": "Prospect Av",
  "220": "Jackson Av",
  "221": "3 Av - 149 St",
  "222": "149 St - Grand Concourse",
  "224": "135 St",
  "225": "125 St",
  "226": "116 St",
  "227": "110 St - Malcolm X Plaza",
  "228": "Park Pl",
  "229": "Fulton St",
  "230": "Wall St",
  "231": "Clark St",
  "232": "Borough Hall",
  "233": "Hoyt St",
  "234": "Nevins St",
  "235": "Atlantic Av - Barclays Ctr",
  "236": "Bergen St",
  "237": "Grand Army Plaza",
  "238": "Eastern Pkwy - Brooklyn Museum",
  "239": "Franklin Av - Medgar Evers College",
  "241": "President St - Medgar Evers College",
  "242": "Sterling St",
  "243": "Winthrop St",
  "244": "Church Av",
  "245": "Beverly Rd",
  "246": "Newkirk Av - Little Haiti",
  "247": "Flatbush Av - Brooklyn College",
  "248": "Nostrand Av",
  "249": "Kingston Av",
  "250": "Crown Hts - Utica Av",
  "251": "Sutter Av - Rutland Rd",
  "252": "Saratoga Av",
  "253": "Rockaway Av",
  "254": "Junius St",
  "255": "Pennsylvania Av",
  "256": "Van Siclen Av",
  "257": "New Lots Av",
  "301": "Harlem - 148 St",
  "302": "145 St",
  "401": "Woodlawn",
  "402": "Mosholu Pkwy",
  "405": "Bedford Park Blvd - Lehman College",
  "406": "Kingsbridge Rd",
  "407": "Fordham Rd",
  "408": "183 St",
  "409": "Burnside Av",
  "410": "176 St",
  "411": "Mt Eden Av",
  "412": "170 St",
  "413": "167 St",
  "414": "161 St - Yankee Stadium",
  "415": "149 St - Grand Concourse",
  "416": "138 St - Grand Concourse",
  "418": "Fulton St",
  "419": "Wall St",
  "420": "Bowling Green",
  "423": "Borough Hall",
  "501": "Eastchester - Dyre Av",
  "502": "Baychester Av",
  "503": "Gun Hill Rd",
  "504": "Pelham Pkwy",
  "505": "Morris Park",
  "601": "Pelham Bay Park",
  "602": "Buhre Av",
  "603": "Middletown Rd",
  "604": "Westchester Sq - E Tremont Av",
  "606": "Zerega Av",
  "607": "Castle Hill Av",
  "608": "Parkchester",
  "609": "St Lawrence Av",
  "610": "Morrison Av - Sound View",
  "611": "Elder Av",
  "612": "Whitlock Av",
  "613": "Hunts Point Av",
  "614": "Longwood Av",
  "615": "E 149 St",
  "616": "E 143 St - St Mary's St",
  "617": "Cypress Av",
  "618": "Brook Av",
  "619": "3 Av - 138 St",
  "621": "125 St",
  "622": "116 St",
  "623": "110 St",
  "624": "103 St",
  "625": "96 St",
  "626": "86 St",
  "627": "77 St",
  "628": "68 St - Hunter College",
  "629": "59 St",
  "630": "51 St",
  "631": "Grand Central - 42 St",
  "632": "33 St",
  "633": "28 St",
  "634": "23 St - Baruch College",
  "635": "14 St - Union Sq",
  "636": "Astor Pl",
  "637": "Bleecker St",
  "638": "Spring St",
  "639": "Canal St",
  "640": "Brooklyn Bridge - City Hall",
  "701": "Flushing - Main St",
  "702": "Mets - Willets Point",
  "705": "111 St",
  "706": "103 St - Corona Plaza",
  "707": "Junction Blvd",
  "708": "90 St - Elmhurst Av",
  "709": "82 St - Jackson Hts",
  "710": "74 St - Broadway",
  "711": "69 St",
  "712": "Woodside - 61 St",
  "713": "52 St",
  "714": "46 St - Bliss St",
  "715": "40 St - Lowery St",
  "716": "33 St - Rawson St",
  "718": "Queensboro Plaza",
  "719": "Court Sq",
  "720": "Hunters Point Av",
  "721": "Vernon Blvd - Jackson Av",
  "723": "Grand Central - 42 St",
  "724": "5 Av",
  "725": "Times Sq - 42 St",
  "726": "34 St - Hudson Yards",
  "901": "Grand Central - 42 St",
  "902": "Times Sq - 42 St",
  L06,
  F14,
  L05,
  F23,
  F12,
  R13,
  L02,
  F24,
  D14,
  D25,
  L01,
  N02,
  R21,
  B12,
  R33,
  R20,
  L03,
  D19,
  A31,
  F25,
  N05,
  F30,
  B19,
  N06,
  B20,
  G24,
  B04,
  D18,
  A30,
  R19,
  B22,
  R35,
  R18,
  R04,
  D17,
  R17,
  A28,
  R06,
  R36,
  G20,
  R08,
  D16,
  A27,
  R39,
  G18,
  D15,
  R15,
  A25,
  B14,
  R40,
  B15,
  B10,
  R14,
  A24,
  R41,
  B16,
  G10,
  G15,
  G09,
  B17,
  Q03,
  A22,
  F07,
  J17,
  R43,
  B18,
  A59,
  A21,
  J16,
  Q04,
  R44,
  A20,
  N10,
  A60,
  Q05,
  A19,
  A18,
  J14,
  A63,
  J13,
  A64,
  A16,
  J12,
  A15,
  A14,
  D13,
  A12,
  D12,
  A11,
  D11,
  A10,
  D10,
  A09,
  F02,
  D09,
  D08,
  A07,
  A06,
  D06,
  A05,
  J24,
  S17,
  H02,
  H01,
  S11,
  R03,
  R01,
  L24,
  R31,
  D24,
  D32,
  F31,
  D33,
  D34,
  F33,
  F34,
  D37,
  F36,
  N09,
  F38,
  B23,
  B21,
  N07,
  F32,
  R45,
  R42,
  S20,
  H10,
  H09,
  H08,
  H07,
  H06,
  H12,
  H13,
  H14,
  L08,
  G33,
  D03,
  F20,
  D29,
  S04,
  M19,
  F05,
  D40,
  H04,
  M23,
  L22,
  A51,
  J27,
  D21,
  R05,
  G30,
  L21,
  A34,
  Q01,
  R23,
  M20,
  L29,
  F21,
  A17,
  M10,
  M21,
  A36,
  J28,
  D28,
  F27,
  R24,
  G34,
  J22,
  S28,
  A44,
  G35,
  D43,
  D30,
  R25,
  F09,
  G22,
  R28,
  J20,
  J19,
  R30,
  L16,
  F15,
  F29,
  S25,
  A03,
  L28,
  F16,
  G13,
  S18,
  M18,
  A55,
  H11,
  M12,
  G31,
  D05,
  M05,
  G08,
  N03,
  B13,
  F26,
  A45,
  S01,
  M04,
  A38,
  M22,
  G36,
  J30,
  L11,
  G12,
  L12,
  D22,
  A57,
  S23,
  S27,
  S19,
  G26,
  J29,
  L19,
  M14,
  A40,
  H03,
  A42,
  S16,
  A02,
  G14,
  F01,
  G05,
  G07,
  R29,
  A41,
  S24,
  L15,
  F06,
  D35,
  F35,
  N08,
  D04,
  A47,
  M09,
  J31,
  A43,
  F11,
  R11,
  B08,
  A52,
  L26,
  M13,
  L10,
  M16,
  G29,
  M01,
  L13,
  L14,
  M11,
  G32,
  L17,
  M08,
  G28,
  D38,
  F39,
  S22,
  L27,
  N04,
  D31,
  G16,
  D01,
  J21,
  A46,
  S21,
  D41,
  S26,
  A65,
  S03,
  D27,
  F03,
  S14,
  R22,
  S15,
  R34,
  D26,
  G21,
  R09,
  A49,
  R26,
  S13,
  A50,
  A61,
  H15,
  B06,
  M06,
  D39,
  A54,
  F22,
  A33,
  S31,
  S29,
  G19,
  F04,
  G06,
  L25,
  R16,
  S30,
  S09,
  D07,
  R32,
  A48,
  J23,
  A53,
  D20,
  A32,
  D42,
  R27,
  L20,
  J15,
  G11,
  E01,
  F18
};
const trainLog = [
  {
    date: "2025-12-01T22:09:52.786Z",
    status: "Delays",
    details: [
      "Southbound: Coney Island - Stillwell Av-bound trains are having longer wait times at Sheepshead Bay (up to 12 mins, normally every 10 mins)."
    ]
  }
];
const QTrainTracker = () => {
  const [status, setStatus] = useState("loading");
  const [data, setData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const fetchData = async () => {
    try {
      const response = await fetch("https://api.subwaynow.app/routes/Q");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      setData(result);
      const hasServiceChanges = result.service_change_summaries?.both?.length > 0 || result.service_change_summaries?.north?.length > 0 || result.service_change_summaries?.south?.length > 0;
      const hasDelays = result.service_irregularity_summaries?.north || result.service_irregularity_summaries?.south;
      if (hasServiceChanges) {
        setStatus("service-change");
      } else if (hasDelays) {
        setStatus("delays");
      } else if (result.status === "Not Scheduled") {
        setStatus("inactive");
      } else {
        setStatus("good");
      }
      setLastUpdated(/* @__PURE__ */ new Date());
    } catch (error) {
      console.error("Error fetching Q train status:", error);
      setStatus("error");
    }
  };
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 6e4);
    return () => clearInterval(interval);
  }, []);
  const getStatusColor = () => {
    switch (status) {
      case "good":
        return "bg-green-100 text-green-800 border-green-200";
      case "service-change":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "delays":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  const getStatusText = () => {
    switch (status) {
      case "good":
        return "Good Service";
      case "service-change":
        return "Service Change";
      case "delays":
        return "Delays";
      case "inactive":
        return "Not Scheduled";
      case "error":
        return "Unable to load status";
      default:
        return "Loading...";
    }
  };
  const renderTripList = (trips, direction) => {
    const tripsByStation = /* @__PURE__ */ new Map();
    if (trips) {
      trips.forEach((trip) => {
        if (!tripsByStation.has(trip.upcoming_stop)) {
          tripsByStation.set(trip.upcoming_stop, []);
        }
        tripsByStation.get(trip.upcoming_stop).push(trip);
      });
    }
    const title = direction === "north" ? "Northbound" : "Southbound";
    return /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxs("h3", { className: "font-bold text-2xl mb-4 text-gray-800 border-b-2 pb-2", children: [
        title,
        " Trains"
      ] }),
      tripsByStation.size === 0 ? /* @__PURE__ */ jsx("p", { className: "text-gray-500 italic", children: "No trains arriving in the next 10 mins." }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: Array.from(tripsByStation.entries()).map(([stationId, stationTrips]) => {
        const nextStop = stationMap[stationId] || stationId;
        return /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded border border-gray-200 shadow-sm", children: [
          /* @__PURE__ */ jsx("div", { className: "flex justify-between items-start mb-3", children: /* @__PURE__ */ jsx("div", { className: "font-bold text-gray-800 text-2xl", children: nextStop }) }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3", children: (() => {
            const tripsByDest = /* @__PURE__ */ new Map();
            stationTrips.forEach((trip) => {
              const dest = stationMap[trip.destination_stop] || trip.destination_stop;
              if (!tripsByDest.has(dest)) {
                tripsByDest.set(dest, []);
              }
              tripsByDest.get(dest).push(trip);
            });
            return Array.from(tripsByDest.entries()).map(([destination, destTrips]) => {
              const times = destTrips.map((t) => Math.max(0, Math.round(t.secondsUntilArrival / 60))).sort((a, b) => a - b);
              return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-between items-center bg-gray-50 p-3 rounded gap-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "text-gray-700", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-bold uppercase tracking-wide text-gray-400 mr-2", children: "To" }),
                  /* @__PURE__ */ jsx("span", { className: "text-xl font-semibold", children: destination })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: times.map((time, i) => /* @__PURE__ */ jsxs("span", { className: "text-lg font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded border border-blue-200", children: [
                  time,
                  " min"
                ] }, i)) })
              ] }, destination);
            });
          })() })
        ] }, stationId);
      }) })
    ] });
  };
  const getTrips = (direction) => {
    if (!data?.trips?.[direction]) return [];
    const now = Math.floor(Date.now() / 1e3);
    const stationOrder = data.actual_routings?.[direction]?.[0] || [];
    const stationIndexMap = {};
    stationOrder.forEach((stationId, index) => {
      stationIndexMap[stationId] = index;
    });
    const uniqueTrips = /* @__PURE__ */ new Map();
    Object.values(data.trips[direction]).flat().forEach((trip) => {
      if (!uniqueTrips.has(trip.id)) {
        uniqueTrips.set(trip.id, trip);
      }
    });
    return Array.from(uniqueTrips.values()).map((trip) => {
      const arrivalTime = trip.upcoming_stop_arrival_time;
      const secondsUntilArrival = arrivalTime - now;
      return { ...trip, secondsUntilArrival };
    }).filter((trip) => {
      if (trip.secondsUntilArrival <= -60 || trip.secondsUntilArrival > 600) return false;
      if (direction === "north" && trip.upcoming_stop === "Q05") return false;
      if (direction === "south" && trip.upcoming_stop === "D43") return false;
      const INTERESTING_STOPS = [
        "D35",
        // Kings Highway
        "D34",
        // Avenue M
        "D31",
        // Newkirk Plaza
        "D26",
        // Prospect Park
        "R30",
        // DeKalb Av
        "Q01",
        // Canal St
        "R20",
        // 14 St - Union Sq
        "R16"
        // Times Sq - 42 St
      ];
      if (!INTERESTING_STOPS.includes(trip.upcoming_stop)) return false;
      return true;
    }).sort((a, b) => {
      const indexA = stationIndexMap[a.upcoming_stop] ?? 9999;
      const indexB = stationIndexMap[b.upcoming_stop] ?? 9999;
      return indexA - indexB;
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-6 bg-white rounded-xl shadow-md space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-2xl border-2 border-black", children: "Q" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-xl font-medium text-black", children: "Q Train Status" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm", children: lastUpdated ? `Updated: ${lastUpdated.toLocaleTimeString()}` : "Checking..." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `p-4 rounded-lg border ${getStatusColor()} transition-colors duration-300`, children: [
        /* @__PURE__ */ jsx("div", { className: "font-bold text-lg mb-1", children: getStatusText() }),
        status === "service-change" && data && /* @__PURE__ */ jsxs("div", { className: "space-y-2 mt-2", children: [
          data.service_change_summaries?.both?.map((text, i) => /* @__PURE__ */ jsx("p", { className: "text-sm", children: text }, `both-${i}`)),
          data.service_change_summaries?.north?.map((text, i) => /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
            "Northbound: ",
            text
          ] }, `north-${i}`)),
          data.service_change_summaries?.south?.map((text, i) => /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
            "Southbound: ",
            text
          ] }, `south-${i}`))
        ] }),
        status === "delays" && data && /* @__PURE__ */ jsxs("div", { className: "space-y-2 mt-2", children: [
          data.service_irregularity_summaries?.north && /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
            "Northbound: ",
            data.service_irregularity_summaries.north
          ] }),
          data.service_irregularity_summaries?.south && /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
            "Southbound: ",
            data.service_irregularity_summaries.south
          ] })
        ] }),
        status === "good" && /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Service is running on or close to schedule." })
      ] })
    ] }),
    data && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      renderTripList(getTrips("north"), "north"),
      renderTripList(getTrips("south"), "south")
    ] }),
    trainLog && trainLog.length > 0 && /* @__PURE__ */ jsxs("div", { className: "p-6 bg-white rounded-xl shadow-md space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-800 border-b pb-2", children: "Service History" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: trainLog.map((entry, index) => /* @__PURE__ */ jsxs("div", { className: "text-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-1", children: [
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-700", children: new Date(entry.date).toLocaleDateString() }),
          /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded text-xs font-medium ${entry.status === "Good Service" ? "bg-green-100 text-green-800" : entry.status === "Service Change" ? "bg-orange-100 text-orange-800" : entry.status === "Delays" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`, children: entry.status })
        ] }),
        entry.details && entry.details.length > 0 && /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside text-gray-600 pl-2", children: entry.details.map((detail, i) => /* @__PURE__ */ jsx("li", { children: detail }, i)) })
      ] }, index)) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-400 text-center", children: "Data provided by goodservice.io" })
  ] });
};
const $$QTrain = createComponent(($$result, $$props, $$slots) => {
  const title = "Q Train Status";
  const description = "Real-time status updates for the Q train.";
  return renderTemplate`${renderComponent($$result, "Layout", $$BaseLayout, { "title": title, "description": description }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main className="container mx-auto px-4 py-12"> <h1 className="text-4xl font-bold text-center mb-8">${title}</h1> <div className="flex justify-center"> ${renderComponent($$result2, "QTrainTracker", QTrainTracker, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/dominickryan/astro_blog/astro_blog/src/components/QTrainTracker.jsx", "client:component-export": "default" })} </div> </main> ` })}`;
}, "/Users/dominickryan/astro_blog/astro_blog/src/pages/q-train.astro", void 0);
const $$file = "/Users/dominickryan/astro_blog/astro_blog/src/pages/q-train.astro";
const $$url = "/q-train";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$QTrain,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
