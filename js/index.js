const BASE_URL = "http://api.login2explore.com:5577";
const IML_URL  = "/api/iml";
const IRL_URL  = "/api/irl";
const DB_NAME  = "SCHOOL-DB";
const REL_NAME = "STUDENT-TABLE";

const CONNECTION_TOKEN = CONFIG.CONNECTION_TOKEN;

let recNo = "";

$(document).ready(function () {
    resetForm();
    $("#rollNo").on("blur", function () {
        const roll = $("#rollNo").val().trim();
        if (roll === "") return;
        checkRollNo(roll);
    });
});

function showMsg(msg, type) {
    $("#msgBox")
        .removeClass("d-none alert-success alert-danger alert-info")
        .addClass("alert-" + type)
        .text(msg);
}

function hideMsg() {
    $("#msgBox").addClass("d-none").text("");
}

function resetForm() {
    recNo = "";
    $("#rollNo, #fullName, #className, #birthDate, #address, #enrollDate").val("");
    $("#fullName, #className, #birthDate, #address, #enrollDate").prop("disabled", true);
    $("#rollNo").prop("disabled", false);
    $("#saveBtn, #updateBtn, #resetBtn").prop("disabled", true);
    hideMsg();
    $("#rollNo").focus();
}

function validateForm() {
    const fields = {
        "rollNo"     : "Roll No",
        "fullName"   : "Full Name",
        "className"  : "Class",
        "birthDate"  : "Birth Date",
        "address"    : "Address",
        "enrollDate" : "Enrollment Date"
    };
    for (let id in fields) {
        if ($("#" + id).val().trim() === "") {
            showMsg("Please fill in: " + fields[id], "danger");
            $("#" + id).focus();
            return false;
        }
    }
    return true;
}

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
        const data = JSON.parse(result.data);
        recNo      = data.rec_no;
        const rec  = data.record;

        $("#fullName").val(rec["Full-Name"]);
        $("#className").val(rec["Class"]);
        $("#birthDate").val(rec["Birth-Date"]);
        $("#address").val(rec["Address"]);
        $("#enrollDate").val(rec["Enrollment-Date"]);

        $("#fullName, #className, #birthDate, #address, #enrollDate").prop("disabled", false);
        $("#rollNo").prop("disabled", true);
        $("#saveBtn").prop("disabled", true);
        $("#updateBtn, #resetBtn").prop("disabled", false);

        showMsg("Record found. You can edit and update.", "info");
        $("#fullName").focus();

    } else {
        $("#fullName, #className, #birthDate, #address, #enrollDate").prop("disabled", false);
        $("#saveBtn, #resetBtn").prop("disabled", false);
        $("#updateBtn").prop("disabled", true);

        showMsg("New Roll No. Fill in the details and save.", "success");
        $("#fullName").focus();
    }
}

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
        showMsg("Student record saved successfully.", "success");
        setTimeout(resetForm, 1500);
    } else {
        showMsg("Save failed: " + result.message, "danger");
    }
}

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
        showMsg("Record updated successfully.", "success");
        setTimeout(resetForm, 1500);
    } else {
        showMsg("Update failed: " + result.message, "danger");
    }
}