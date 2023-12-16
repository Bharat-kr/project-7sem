// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract HealthChain {
    enum Role {
        Doctor, Patient
    }
    mapping(address => Role) public roles;
    struct Record {
        string name;
        string url;
        string upload_date;
    }
    
    struct Disease {
        string id;
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
    
    struct DiseaseRes {
        string id;
        string name;
        Doctor doctor;
        uint256 created_at;
    }
    mapping(address => Patient) public patients;//all patients
    mapping(address => Doctor) public doctors;//all doctors
    mapping(string => Disease) public diseases;//all diseases
    mapping(address => Disease[]) public patients_disease_map;//patients diseases
    mapping(string => Record[]) public diesase_record_map; //illness to records map

    //get initial status
    function getStatus() public view returns (string memory) {
        if(roles[msg.sender] == Role.Doctor){
            return "Doctor";
        }else if(roles[msg.sender] == Role.Patient){
            return "Patient";
        }else{
            return "Unregistered";
        }
    }

    // Doctor functions
    function getDoctor() public view returns (Doctor memory) {
        return doctors[msg.sender];
    }
    function addDoctor(string memory name , uint256 age , string memory gender, string memory hospital_name) public {
        Doctor memory newDoc;
        newDoc.name = name;
        newDoc.wallet_address = msg.sender;
        newDoc.age = age;
        newDoc.gender = gender;
        newDoc.hospital_name = hospital_name;
        doctors[msg.sender] = newDoc; 
        roles[msg.sender] = Role.Doctor;
    }
    function getAllPatients() public view returns (Patient[] memory) {
        Doctor memory curr_doctor = doctors[msg.sender];
        Patient[] memory doctorPatients = new Patient[](curr_doctor.patients.length);
        for (uint256 i = 0; i < curr_doctor.patients.length; i++) {
            doctorPatients[i] = patients[curr_doctor.patients[i]];
        }
        return doctorPatients;
    }
    
    function getPatientsDiseases(address patient_address) public view returns (Disease[] memory) {
        return patients_disease_map[patient_address];
    }

    // Patient functions
    function addPatient(string memory name, uint256 age, string memory gender) public {
        Patient memory newPatient;
        newPatient.name = name;
        newPatient.age = age;
        newPatient.wallet_address = msg.sender;
        newPatient.gender = gender;
        patients[msg.sender] = newPatient;
        roles[msg.sender] = Role.Patient;
    }

    function getPatient() public view returns (Patient memory) {
        return patients[msg.sender];
    }
    
    function getDiseases() public view returns (DiseaseRes[] memory) {
        Disease[] memory currDiseases = patients_disease_map[msg.sender];
        DiseaseRes[] memory ans = new DiseaseRes[](currDiseases.length);
        for(uint256 i=0;i<currDiseases.length;i++){
            ans[i].id = currDiseases[i].id;
            ans[i].name = currDiseases[i].name;
            ans[i].created_at = currDiseases[i].created_at;
            ans[i].doctor = doctors[currDiseases[i].doctor];
        }
        return ans;
    }
    
    // Add illness for a patient
    function addDisease(string memory id, string memory diseaseName, address doctor_address) public {
        Disease memory newDisease ;
        newDisease.id = id;
        newDisease.name = diseaseName;
        newDisease.doctor = doctor_address;
        //doctor ke pass array hai patient ka map me update that
        doctors[doctor_address].patients.push(msg.sender);
        //end
        newDisease.created_at = block.timestamp;
        diseases[id] = newDisease;
        patients_disease_map[msg.sender].push(newDisease);
    }
    function addRecord(string memory name , string memory url , string memory upload_date , string memory id)public {
        Record memory newRec;
        newRec.name = name;
        newRec.url = url;
        newRec.upload_date = upload_date;
        diesase_record_map[id].push(newRec);
    }    
    function getRecords(string memory id)public view returns(Record[] memory){
        return diesase_record_map[id];
    }
}
