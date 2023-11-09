// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract HealthChain {
    string role_docter="Doctor";
    string role_patient="Patient";
    struct Record {
        string name;
        string url;
        string upload_date;
    }
    
    struct Illness {
        string ill_id;
        string name;
        address doctor;
        uint256 created_at;
    }
    
    struct Patient {
        string name;
        uint256 age;
        address wallet_address;
        string gender;
    }
    
    struct Doctor {
        string name;
        uint256 age;
        string gender;
        address wallet_address;
        string hospital_name;
        address[] patients;
    }
    
    struct IllnessRes {
        string ill_id;
        string name;
        Doctor doctor;
        uint256 created_at;
    }
    mapping(address => Patient) public patients;//all patients
    mapping(address => Doctor) public doctors;//all doctors
    mapping(string => Illness) public illnuses;//all illnuses
    mapping(address => Illness[]) public patients_illness_map;//patients illnuses
    mapping(string => Record[]) public illness_record_map; //illness to records map
    mapping(address => string) public person_roles;

    //get initial status
    function getStatus() public view returns (string memory) {
        string storage role = person_roles[msg.sender];
        if (keccak256(abi.encodePacked(role)) == keccak256(abi.encodePacked(role_docter)) || keccak256(abi.encodePacked(role)) == keccak256(abi.encodePacked(role_patient))) {
            return role;
        } else {
            return "Unregistered";
        }
    }

    // Doctor functions
    function getDoctor() public view returns (Doctor memory) {
        return doctors[msg.sender];
    }
    function createDoctor(string memory name , uint256 age , string memory gender, string memory hospital_name) public {
        Doctor memory newDoc;
        newDoc.name = name;
        newDoc.wallet_address = msg.sender;
        newDoc.age = age;
        newDoc.gender = gender;
        newDoc.hospital_name = hospital_name;
        doctors[msg.sender] = newDoc;
        person_roles[msg.sender] = role_docter;
    }
    function getAllPatients() public view returns (Patient[] memory) {
        Doctor memory curr_doctor = doctors[msg.sender];
        Patient[] memory doctorPatients = new Patient[](curr_doctor.patients.length);
        for (uint256 i = 0; i < curr_doctor.patients.length; i++) {
            doctorPatients[i] = patients[curr_doctor.patients[i]];
        }
        return doctorPatients;
    }
    
    function getPatientsIllness(address patient_address) public view returns (Illness[] memory) {
        return patients_illness_map[patient_address];
    }

    // Patient functions
    function createPatient(string memory name, uint256 age, string memory gender) public {
        Patient memory newPatient;
        newPatient.name = name;
        newPatient.age = age;
        newPatient.wallet_address = msg.sender;
        newPatient.gender = gender;
        patients[msg.sender] = newPatient;
        person_roles[msg.sender] = role_patient;
    }

    function getPatient() public view returns (Patient memory) {
        return patients[msg.sender];
    }
    
    function getIllnesses() public view returns (IllnessRes[] memory) {
        Illness[] memory curr_ills = patients_illness_map[msg.sender];
        IllnessRes[] memory ans = new IllnessRes[](curr_ills.length);
        for(uint256 i=0;i<curr_ills.length;i++){
            ans[i].ill_id = curr_ills[i].ill_id;
            ans[i].name = curr_ills[i].name;
            ans[i].created_at = curr_ills[i].created_at;
            ans[i].doctor = doctors[curr_ills[i].doctor];
        }
        return ans;
    }
    
    // Add illness for a patient
    function addIllness(string memory ill_id, string memory illnessName, address doctor_address) public {
        Illness memory newIllness ;
        newIllness.ill_id = ill_id;
        newIllness.name = illnessName;
        newIllness.doctor = doctor_address;
        //doctor ke pass array hai patient ka map me update that
        Doctor memory doctor_to_add = doctors[doctor_address];
        address[] memory old_patients = doctor_to_add.patients;
        address[] memory new_patients = new address[](old_patients.length+1);
        for(uint256 i =0;i<old_patients.length;i++){
            new_patients[i]  = old_patients[i];
        }
        new_patients[old_patients.length] = msg.sender;
        //end
        newIllness.created_at = block.timestamp;
        illnuses[ill_id] = newIllness;
        Illness[] memory curr_illnuses = patients_illness_map[msg.sender];
        Illness[] memory new_ills = new Illness[](curr_illnuses.length+1);
        for(uint256 i =0;i<curr_illnuses.length;i++){
            new_ills[i] = curr_illnuses[i];
        }
        new_ills[curr_illnuses.length] = newIllness;
    }
    function addRecord(string memory name , string memory url , string memory upload_date , string memory ill_id)public view{
        Record memory newRec;
        newRec.name = name;
        newRec.url = url;
        newRec.upload_date = upload_date;
        Record[] memory curr_reports = illness_record_map[ill_id];
        Record[] memory new_reports = new Record[](curr_reports.length+1);
        for(uint256 i =0;i<curr_reports.length;i++){
            new_reports[i] = curr_reports[i];
        }
        new_reports[curr_reports.length] = newRec;
    }    
    function getRecords(string memory ill_id)public view returns(Record[] memory){
        return illness_record_map[ill_id];
    }
}
