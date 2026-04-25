# Student Enrollment Form using JsonPowerDB

## Description
A micro project built as part of the Login2Xplore JsonPowerDB course.
It is a student enrollment form that stores and updates student records
in JsonPowerDB using REST APIs and AJAX. The form checks if a Roll No
exists in the database. If it does not exist, the user can fill and save
the record. If it exists, the existing data is loaded and the user can
update it.

## Benefits of using JsonPowerDB
- Simple to use and requires minimal development effort
- Serverless architecture so no backend setup is needed
- Supports REST API which makes it easy to integrate with any frontend
- High performance and real time data processing
- Works with structured, semi structured and unstructured data
- No need to pre define databases, tables or schemas
- Reduces development time and overall project cost
- Supports multiple database modes like document DB, key value DB and more

## Table of Contents
- Description
- Benefits of using JsonPowerDB
- Database Details
- Input Fields
- Scope of Functionalities
- Tech Stack
- Setup
- Examples of Use
- Project Status
- Release History
- Sources

## Database Details
| Field | Value |
|---|---|
| Database Name | SCHOOL-DB |
| Relation Name | STUDENT-TABLE |
| Primary Key | Roll-No |

## Input Fields
| Field | Type |
|---|---|
| Roll No | Text, Primary Key |
| Full Name | Text |
| Class | Text |
| Birth Date | Date |
| Address | Text |
| Enrollment Date | Date |

## Scope of Functionalities
- Enter Roll No to check if a student exists in the database
- If the Roll No is new, all fields get enabled and the Save button is activated
- If the Roll No already exists, the form loads the saved data and the Update button is activated
- Primary key field gets locked when updating an existing record
- All fields are validated before saving or updating, no empty fields are allowed
- Form resets automatically after every successful save or update
- Cursor always returns to Roll No field after reset

## Tech Stack
- HTML5
- Bootstrap 5
- JavaScript
- jQuery
- AJAX
- JsonPowerDB by Login2Xplore

## Setup
1. Clone this repository
2. Inside the js folder, copy config.example.js and rename the copy to config.js
3. Open config.js and replace YOUR_CONNECTION_TOKEN_HERE with your actual JPDB token
4. Open index.html directly in a browser, no server setup is needed

## Getting the JPDB Token
1. Register at http://api.login2explore.com:5577/user/index.html
2. Login and go to Tools
3. Click on Tokens
4. Select connection-token from the dropdown
5. Copy the token and paste it in config.js

## Examples of Use
- Enter Roll No 101 and press Tab or click outside the field
- If 101 does not exist, fill in the remaining details and click Save
- The record gets stored in JPDB and the form resets
- Enter Roll No 101 again and the form will load the saved data
- Edit any field and click Update to save the changes

## Project Status
Completed

## Release History
| Version | Date | Description |
|---|---|---|
| v1.0 | 2026-04-25 | Initial release with Save and Update functionality using JsonPowerDB |

## Sources
- JsonPowerDB Documentation: https://login2explore.com/jpdb/docs.html
- Login2Xplore: https://login2explore.com
- Bootstrap: https://getbootstrap.com
- jQuery: https://jquery.com