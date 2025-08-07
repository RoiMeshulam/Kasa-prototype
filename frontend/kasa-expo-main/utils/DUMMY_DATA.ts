export const machines = [
  {
    id_machine: "001",
    name: "תל אביב – קניון עזריאלי",
    status: "פנויה",
    maintenance_last: "2025-07-12",
    latitude: 32.068002,
    longitude: 34.783223,
    qr_code: "qr-machine-001-TLV-Azrieli",
  },
  {
    id_machine: "002",
    name: "חיפה – מרכז חורב",
    status: "מלאה",
    maintenance_last: "2025-06-25",
    latitude: 32.794,
    longitude: 34.9896,
    qr_code: "qr-machine-002-HFA-Horev",
  },
  {
    id_machine: "003",
    name: "ירושלים – התחנה המרכזית",
    status: "תקלה",
    maintenance_last: "2025-05-30",
    latitude: 31.7894,
    longitude: 35.2007,
    qr_code: "qr-machine-003-JRS-Central",
  },
  {
    id_machine: "004",
    name: "באר שבע – גרנד קניון",
    status: "פנויה",
    maintenance_last: "2025-07-20",
    latitude: 31.2518,
    longitude: 34.7913,
    qr_code: "qr-machine-004-B7-Grand",
  },
  {
    id_machine: "005",
    name: "ראשון לציון – קניון הזהב",
    status: "מלאה",
    maintenance_last: "2025-08-01",
    latitude: 31.99051,
    longitude: 34.7742,
    qr_code: "qr-machine-005-RS-GoldMall",
  },
  {
    id_machine: "006",
    name: "נתניה – פולג",
    status: "פנויה",
    maintenance_last: "2025-07-15",
    latitude: 32.2916,
    longitude: 34.8506,
    qr_code: "qr-machine-006-NTN-Poleg",
  },
  {
    id_machine: "007",
    name: "רמת גן – בורסה",
    status: "תקלה",
    maintenance_last: "2025-04-18",
    latitude: 32.0832,
    longitude: 34.7995,
    qr_code: "qr-machine-007-RG-Bursa",
  },
  {
    id_machine: "008",
    name: "אשדוד – סטאר סנטר",
    status: "מלאה",
    maintenance_last: "2025-07-30",
    latitude: 31.8044,
    longitude: 34.6553,
    qr_code: "qr-machine-008-ASD-StarCenter",
  },
  {
    id_machine: "009",
    name: "פתח תקווה – אם המושבות",
    status: "פנויה",
    maintenance_last: "2025-06-10",
    latitude: 32.0916,
    longitude: 34.8864,
    qr_code: "qr-machine-009-PTK-EmHaMoshavot",
  },
  {
    id_machine: "010",
    name: "חולון – עזריאלי",
    status: "תקלה",
    maintenance_last: "2025-07-01",
    latitude: 32.0158,
    longitude: 34.774,
    qr_code: "qr-machine-010-HOL-Azrieli",
  },
];

export const users = [
  {
    id_user: "u001",
    name: "דנה כהן",
    phone_or_email: "dana@example.com",
    balance: 32.5,
    bottles_total: 48,
    id_device: "001",
    hash_password: "5f4dcc3b5aa765d61d8327deb882cf99", // "password"
  },
  {
    id_user: "u002",
    name: "יוסי לוי",
    phone_or_email: "yossi_levi@gmail.com",
    balance: 15.0,
    bottles_total: 22,
    id_device: "002",
    hash_password: "202cb962ac59075b964b07152d234b70", // "123"
  },
  {
    id_user: "u003",
    name: "נועה בר",
    phone_or_email: "+972501234567",
    balance: 67.8,
    bottles_total: 105,
    id_device: "005",
    hash_password: "81dc9bdb52d04dc20036dbd8313ed055", // "1234"
  },
  {
    id_user: "u004",
    name: "מיכאל צור",
    phone_or_email: "michael@tzur.org",
    balance: 0.0,
    bottles_total: 0,
    id_device: "010",
    hash_password: "098f6bcd4621d373cade4e832627b4f6", // "test"
  },
  {
    id_user: "u005",
    name: "רוני ישראלי",
    phone_or_email: "+972546789012",
    balance: 11.2,
    bottles_total: 13,
    id_device: "003",
    hash_password: "25d55ad283aa400af464c76d713c07ad", // "12345678"
  },
];

export const transactions = [
  {
    id_transaction: "t001",
    id_user: "u001",
    id_machine: "001",
    location_name: "תל אביב – קניון עזריאלי",
    date: "2025-08-01T10:15:00",
    bottles_count: 8,
    amount: 5.6,
    status: "הצלחה",
  },
  {
    id_transaction: "t002",
    id_user: "u002",
    id_machine: "002",
    location_name: "חיפה – מרכז חורב",
    date: "2025-08-02T14:45:00",
    bottles_count: 4,
    amount: 2.8,
    status: "הצלחה",
  },
  {
    id_transaction: "t003",
    id_user: "u003",
    id_machine: "005",
    location_name: "ראשון לציון – קניון הזהב",
    date: "2025-07-30T09:20:00",
    bottles_count: 10,
    amount: 7.0,
    status: "הצלחה",
  },
  {
    id_transaction: "t004",
    id_user: "u004",
    id_machine: "010",
    location_name: "חולון – עזריאלי",
    date: "2025-07-29T17:10:00",
    bottles_count: 0,
    amount: 0.0,
    status: "כשל",
  },
  {
    id_transaction: "t005",
    id_user: "u005",
    id_machine: "003",
    location_name: "ירושלים – התחנה המרכזית",
    date: "2025-08-01T13:00:00",
    bottles_count: 5,
    amount: 3.5,
    status: "הצלחה",
  },
  {
    id_transaction: "t006",
    id_user: "u001",
    id_machine: "004",
    location_name: "באר שבע – גרנד קניון",
    date: "2025-08-03T08:30:00",
    bottles_count: 12,
    amount: 8.4,
    status: "הצלחה",
  },
  {
    id_transaction: "t007",
    id_user: "u003",
    id_machine: "001",
    location_name: "תל אביב – קניון עזריאלי",
    date: "2025-08-04T11:25:00",
    bottles_count: 0,
    amount: 0.0,
    status: "ממתין",
  },
  {
    id_transaction: "t008",
    id_user: "u002",
    id_machine: "007",
    location_name: "רמת גן – בורסה",
    date: "2025-08-05T15:00:00",
    bottles_count: 3,
    amount: 2.1,
    status: "הצלחה",
  },
  {
    id_transaction: "t009",
    id_user: "u005",
    id_machine: "003",
    location_name: "ירושלים – התחנה המרכזית",
    date: "2025-08-06T09:45:00",
    bottles_count: 6,
    amount: 4.2,
    status: "הצלחה",
  },
  {
    id_transaction: "t010",
    id_user: "u004",
    id_machine: "008",
    location_name: "אשדוד – סטאר סנטר",
    date: "2025-08-06T10:15:00",
    bottles_count: 7,
    amount: 4.9,
    status: "הצלחה",
  },
];

export const bottles_detailed = [
  {
    id_transaction: "t001",
    brand: "קוקה קולה",
    material: "פחית",
    quantity: 3,
  },
  {
    id_transaction: "t001",
    brand: "נביעות",
    material: "פלסטיק",
    quantity: 5,
  },
  {
    id_transaction: "t002",
    brand: "מי עדן",
    material: "פלסטיק",
    quantity: 4,
  },
  {
    id_transaction: "t003",
    brand: "נסטי",
    material: "זכוכית",
    quantity: 4,
  },
  {
    id_transaction: "t003",
    brand: "קוקה קולה זירו",
    material: "פלסטיק",
    quantity: 6,
  },
  {
    id_transaction: "t004",
    brand: "פפסי",
    material: "פלסטיק",
    quantity: 0,
  },
  {
    id_transaction: "t005",
    brand: "ספרייט",
    material: "פחית",
    quantity: 2,
  },
  {
    id_transaction: "t005",
    brand: "אקוויפינה",
    material: "פלסטיק",
    quantity: 3,
  },
  {
    id_transaction: "t006",
    brand: "קוקה קולה",
    material: "פלסטיק",
    quantity: 10,
  },
  {
    id_transaction: "t006",
    brand: "קוקה קולה",
    material: "פחית",
    quantity: 2,
  },
  {
    id_transaction: "t007",
    brand: "פנטה",
    material: "פלסטיק",
    quantity: 0,
  },
  {
    id_transaction: "t008",
    brand: "ספרייט",
    material: "פחית",
    quantity: 3,
  },
  {
    id_transaction: "t009",
    brand: "נביעות",
    material: "פלסטיק",
    quantity: 4,
  },
  {
    id_transaction: "t009",
    brand: "קוקה קולה",
    material: "פחית",
    quantity: 2,
  },
  {
    id_transaction: "t010",
    brand: "בירה גולדסטאר",
    material: "זכוכית",
    quantity: 7,
  },
];

export interface User {
  id_user: string;
  name: string;
  phone_or_email: string;
  balance: number;
  bottles_total: number;
  id_device: string;
  hash_password: string;
}

export interface Machine {
  id_machine: string;
  name: string;
  status: "פנויה" | "מלאה" | "תקלה";
  maintenance_last: string; // ISO date string
  latitude: number;
  longitude: number;
  qr_code: string;
}

export interface Transaction {
  id_transaction: string;
  id_user: string;
  id_machine: string;
  location_name: string;
  date: string;
  bottles_count: number;
  amount: number;
  status: "הצלחה" | "כשל" | "ממתין";
}

export interface BottleDetail {
  id_transaction: string;
  brand: string;
  material: "פלסטיק" | "פחית" | "זכוכית";
  quantity: number;
}
