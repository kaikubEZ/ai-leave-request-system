# AI Leave Request System

สรุปโปรเจค
-----------
AI Leave Request System เป็นเว็บแอปสำหรับช่วยนิสิต/นักศึกษาสร้างอีเมลขอลาโดยอัตโนมัติจากข้อมูลตารางเรียนและเหตุผลการขาดเรียน ระบบสกัดข้อมูลผู้สอนจากตาราง แล้วเรียกใช้ LLM (Google Generative Language API) เพื่อสร้างอีเมลแบบสุภาพทั้งภาษาไทยและอังกฤษ ผู้ใช้สามารถตรวจสอบและแก้ไขก่อนส่งจริง

สมาชิกกลุ่ม 21
Theerith Tantirodchanamate (Leader)
Alangkorn Thongkhong
Sarana Thanadeecharoenchok
Ratchaphon Pungtamgerdpol
Phumsith Sirichotevanich
Thanasorn Thanamaschaijaroen
GitHub: https://github.com/kaikubEZ/ai-leave-request-system

ไดเรกทอรีสำคัญ
-----------------
- `backend/` - Node.js + Express API, จุดเรียก LLM อยู่ที่ `backend/src/tableController.js` (ฟังก์ชัน `sendAbsenceMessage`) 
- `frontend/` - หน้าเว็บ HTML/CSS/JS ที่รับ Student ID, แก้ไขตารางเรียน และเรียก API

คุณสมบัติหลัก
----------------
- สร้างอีเมลขอลาอัตโนมัติสำหรับแต่ละวิชา (ไทย/อังกฤษ)
- Frontend แสดงผลให้ผู้ใช้ตรวจสอบ (`aiResults`)
- เก็บตารางเรียนใน MongoDB ได้ (optional)

ข้อกำหนดเบื้องต้น
-------------------
- Node.js (v16+) และ npm
- (ถ้าต้องการ DB) MongoDB running และ `MONGO_URL`
- Google Generative Language API key (`GEMINI_API_KEY`)

การติดตั้งและรัน (PowerShell)
--------------------------------
1. เปิด PowerShell แล้วไปที่โฟลเดอร์ `backend`:

```powershell
cd "c:\Users\...\ai-leave-request-system-jian-branch\backend"
```

2. สร้างไฟล์ env และตั้งค่า:

```powershell
Copy-Item .env.example .env
# แก้ .env ใส่ GEMINI_API_KEY และ MONGO_URL (ถ้ามี)
notepad .env
```

3. ติดตั้ง dependency และรันเซิร์ฟเวอร์:

```powershell
npm install
npm start
```

4. เปิดไฟล์ `frontend/index.html` ในเบราว์เซอร์เพื่อใช้งาน UI

API endpoints ที่สำคัญ
----------------------
- GET `/api/timetable/:id` — โหลดตารางเรียนของนักเรียน (จาก DB)
- PUT `/api/timetable` — อัพเดตตารางเรียน
- DELETE `/api/timetable/:id` — ลบตารางเรียน
- POST `/api/absence` — ส่งคำขอขาดเรียนพร้อม `affectedClasses` → backend จะเรียก LLM และคืนผล

ตัวอย่างการเรียก `POST /api/absence` (PowerShell / Invoke-RestMethod)
```powershell
$body = @{
	studentId = 12345
	day = 'monday'
	reason = 'fever'
	affectedClasses = @(
		@{ subject = 'Math'; teacher = 'Mr A'; email = 'a@example.com' }
		@{ subject = 'Science'; teacher = 'Ms B'; email = 'b@example.com' }
	)
} | ConvertTo-Json -Depth 5

Invoke-RestMethod -Uri http://localhost:3222/api/absence -Method Post -Body $body -ContentType 'application/json'
```

หรือ curl:
```bash
curl -X POST http://localhost:3222/api/absence \
	-H "Content-Type: application/json" \
	-d '{"studentId":"12345","day":"monday","reason":"fever","affectedClasses":[{"subject":"Math","teacher":"Mr A","email":"a@example.com"}] }'
```

Environment variables
---------------------
- `GEMINI_API_KEY` — คีย์ API ของ Google Generative Language (ต้องอยู่ใน `backend/.env`)
- `MONGO_URL` — connection string ของ MongoDB (ถ้าใช้งาน DB)

โครงสร้าง prompt และการตอบของ LLM
----------------------------------
Backend จะรวมข้อมูล `studentId`, `day`, `reason` และ `affectedClasses` เป็น prompt ที่ชัดเจน (prompt engineering) แล้วส่งไปยัง endpoint ของ Google Generative Language API (`gemini-2.0-flash`) ในรูปแบบ JSON ตามสเปค `{ contents: [{ parts: [{ text: "<prompt>" }] }] }` การตอบกลับจะถูกสกัดเป็นข้อความที่อ่านได้ (`text`) และเก็บ `raw` สำหรับดีบัก หากต้องการใช้งานเชิงอัตโนมัติเพิ่มเติม ควรกำหนดให้โมเดลคืนผลเป็น JSON โครงสร้างและเพิ่ม schema validation

ข้อแนะนำก่อนใช้งานจริง
-----------------------
- เก็บคีย์ในฝั่ง server เท่านั้น (ไม่ใส่ใน frontend)
- เพิ่ม input validation, rate limiting, timeout/retry policy
- พิจารณาให้โมเดลตอบเป็น JSON หากระบบต้องส่งอีเมลจริงโดยอัตโนมัติ

ผลงานและไฟล์อ้างอิง
---------------------
- Backend: `backend/src/tableController.js`, `backend/src/tableRoute.js`, `backend/src/tableModel.js`
- Frontend: `frontend/index.html`, `frontend/script.js`, `frontend/styles.css`
- Env example: `backend/.env.example`

ต้องการให้ผมเพิ่มตัวอย่าง prompt ที่บังคับให้โมเดลคืน JSON หรือเพิ่ม script ทดสอบ (Jest/Node) ให้ใน repo ไหม? แจ้งได้เลยผมจะจัดให้


