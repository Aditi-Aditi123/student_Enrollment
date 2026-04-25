// ================================================================
// Student Enrollment Form — Logic
// Database : SCHOOL-DB
// Relation : STUDENT-TABLE
// Primary Key : Roll-No
// ================================================================

const BASE_URL = "http://api.login2explore.com:5577";
const IML_URL  = "/api/iml";   // for PUT and UPDATE
const IRL_URL  = "/api/irl";   // for GET
const DB_NAME  = "SCHOOL-DB";
const REL_NAME = "STUDENT-TABLE";

// Token comes from config.js (not on GitHub)
const CONNECTION_TOKEN = CONFIG.CONNECTION_TOKEN;

let recNo = ""; // will store record number when updating

// ── On Page Load ─────────────────────────────────────────────────
$(document).ready(function () {
    resetForm();

    // When user types Roll No and moves to next field
    $("#rollNo").on("blur", function () {
        const roll = $("#rollNo").val().trim();
        if (roll === "") return;
        checkRollNo(roll);
    });
});

// ── Show Message ──────────────────────────────────────────────────
function showMsg(msg, type) {
    // type = "success" | "danger" | "info"
    $("#msgBox")
        .removeClass("d-none alert-success alert-danger alert-info")
        .addClass("alert-" + type)
        .text(msg);
}

function hideMsg() {
    $("#msgBox").addClass("d-none").text("");
}

// ── Reset Form to Initial State ───────────────────────────────────
function resetForm() {
    recNo = "";

    // Clear all input fields
    $("#rollNo, #fullName, #className, #birthDate, #address, #enrollDate")
        .val("");

    // Disable all fields except Roll No
    $("#fullName, #className, #birthDate, #address, #enrollDate")
        .prop("disabled", true);

    // Enable only Roll No
    $("#rollNo").prop("disabled", false);

    // Disable ALL buttons
    $("#saveBtn, #updateBtn, #resetBtn").prop("disabled", true);

    // Hide any messages
    hideMsg();

    // Cursor goes to Roll No automatically
    $("#rollNo").focus();
}

// ── Validate — No Empty Fields Allowed ───────────────────────────
function validateForm() {
    const fields = {
        "rollNo"    : "Roll No",
        "fullName"  : "Full Name",
        "className" : "Class",
        "birthDate" : "Birth Date",
        "address"   : "Address",
        "enrollDate": "Enrollment Date"
    };

    for (let id in fields) {
        if ($("#" + id).val().trim() === "") {
            showMsg("⚠️ Please fill in: " + fields[id], "danger");
            $("#" + id).focus();
            return false;
        }
    }
    return true;
}

// ── Check Roll No in JPDB ─────────────────────────────────────────
function checkRollNo(roll) {

    const getReq = JSON.stringify({
        token   : CONNECTION_TOKEN,
        cmd     : "GET",
        dbName  : DB_NAME,
        rel     : REL_NAME,
        jsonStr : { "Roll-No" : roll }
    });

    jQuery.ajaxSetup({ async: false });
    let result;
    try {
        result = executeCommandAtGivenBaseUrl(getReq, BASE_URL, IRL_URL);
    } catch (e) {
        result = null;
    }
    jQuery.ajaxSetup({ async: true });

    if (result && result.status === 200) {
        // ── Record EXISTS ─────────────────────────────────────────
        const data = JSON.parse(result.data);
        recNo      = data.rec_no;       // save for UPDATE later
        const rec  = data.record;

        // Fill form with existing data
        $("#fullName").val(rec["Full-Name"]);
        $("#className").val(rec["Class"]);
        $("#birthDate").val(rec["Birth-Date"]);
        $("#address").val(rec["Address"]);
        $("#enrollDate").val(rec["Enrollment-Date"]);

        // Enable other fields for editing
        $("#fullName, #className, #birthDate, #address, #enrollDate")
            .prop("disabled", false);

        // Lock Roll No (primary key should not change)
        $("#rollNo").prop("disabled", true);

        // Enable Update + Reset, disable Save
        $("#saveBtn").prop("disabled", true);
        $("#updateBtn, #resetBtn").prop("disabled", false);

        showMsg("✅ Record found! You can edit and update.", "info");
        $("#fullName").focus();

    } else {
        // ── Record does NOT EXIST ─────────────────────────────────
        // Enable all fields for new entry
        $("#fullName, #className, #birthDate, #address, #enrollDate")
            .prop("disabled", false);

        // Enable Save + Reset, disable Update
        $("#saveBtn, #resetBtn").prop("disabled", false);
        $("#updateBtn").prop("disabled", true);

        showMsg("🆕 New Roll No detected. Fill details and Save.", "success");
        $("#fullName").focus();
    }
}

// ── Save New Record (PUT) ─────────────────────────────────────────
function saveData() {
    if (!validateForm()) return;

    const jsonStr = {
        "Roll-No"         : $("#rollNo").val().trim(),
        "Full-Name"       : $("#fullName").val().trim(),
        "Class"           : $("#className").val().trim(),
        "Birth-Date"      : $("#birthDate").val().trim(),
        "Address"         : $("#address").val().trim(),
        "Enrollment-Date" : $("#enrollDate").val().trim()
    };

    const putReq = createPUTRequest(
        CONNECTION_TOKEN,
        JSON.stringify(jsonStr),
        DB_NAME,
        REL_NAME
    );

    jQuery.ajaxSetup({ async: false });
    const result = executeCommandAtGivenBaseUrl(putReq, BASE_URL, IML_URL);
    jQuery.ajaxSetup({ async: true });

    if (result.status === 200) {
        showMsg("✅ Student enrolled successfully!", "success");
        setTimeout(resetForm, 1500); // reset after 1.5 seconds
    } else {
        showMsg("❌ Save failed: " + result.message, "danger");
    }
}

// ── Update Existing Record ────────────────────────────────────────
function updateData() {
    if (!validateForm()) return;

    const updateJson = {
        [recNo] : {
            "Full-Name"       : $("#fullName").val().trim(),
            "Class"           : $("#className").val().trim(),
            "Birth-Date"      : $("#birthDate").val().trim(),
            "Address"         : $("#address").val().trim(),
            "Enrollment-Date" : $("#enrollDate").val().trim()
        }
    };

    const updateReq = createUPDATERecordRequest(
        CONNECTION_TOKEN,
        JSON.stringify(updateJson),
        DB_NAME,
        REL_NAME
    );

    jQuery.ajaxSetup({ async: false });
    const result = executeCommandAtGivenBaseUrl(updateReq, BASE_URL, IML_URL);
    jQuery.ajaxSetup({ async: true });

    if (result.status === 200) {
        showMsg("✅ Record updated successfully!", "success");
        setTimeout(resetForm, 1500); // reset after 1.5 seconds
    } else {
        showMsg("❌ Update failed: " + result.message, "danger");
    }
}