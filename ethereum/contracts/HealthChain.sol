// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract HealthChain {
    enum Role {
        Doctor, Patient
    }
    mapping(address => Role) private roles;

    struct Record {
        string name;
        string url;
        string uploadDate;
    }
    
    struct Disease {
        string id;
        string name;
        address doctor;
        address patient;
        uint256 createdAt;
    }
    
    struct Patient {
        string name;
        uint8 age;
        address walletAddress;
        string gender;
    }
    
    struct Doctor {
        string name;
        uint8 age;
        string gender;
        address walletAddress;
        string hospitalName;
        address[] patients;
    }
    
    struct DiseaseRes {
        string id;
        string name;
        Doctor doctor;
        uint256 createdAt;
    }
    mapping(address => Patient) private patients;//all patients
    mapping(address => Doctor) private doctors;//all doctors
    mapping(string => Disease) private diseases;//all diseases
    mapping(address => Disease[]) private patients_disease_map;//patients diseases
    mapping(string => Record[]) private diesase_record_map; //disease to records map

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
    function addDoctor(string memory name , uint8 age , string memory gender, string memory hospitalName) public {
        Doctor memory newDoc;
        newDoc.name = name;
        newDoc.walletAddress = msg.sender;
        newDoc.age = age;
        newDoc.gender = gender;
        newDoc.hospitalName = hospitalName;
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
    function addPatient(string memory name, uint8 age, string memory gender) public {
        patients[msg.sender] = Patient({name:name ,age:age , walletAddress:msg.sender , gender:gender});
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
            ans[i].createdAt = currDiseases[i].createdAt;
            ans[i].doctor = doctors[currDiseases[i].doctor];
        }
        return ans;
    }
    
    // Add disease for a patient
    function addDisease(string memory id, string memory diseaseName, address doctor_address) public {
        //doctor ke pass array hai patient ka map me update that
        doctors[doctor_address].patients.push(msg.sender);
        //end
        diseases[id] = Disease({id :id , name : diseaseName , doctor:doctor_address , patient:msg.sender, createdAt:block.timestamp});
        patients_disease_map[msg.sender].push(Disease({id :id , name : diseaseName , doctor:doctor_address , patient:msg.sender, createdAt:block.timestamp}));
    }

    //add records
    function addRecord(string memory name , string memory url , string memory uploadDate , string memory diseaseId)public {
        require(diseases[diseaseId].doctor == msg.sender ||diseases[diseaseId].patient == msg.sender  , "Unauthorized access to disease records");

        diesase_record_map[diseaseId].push(Record({name: name, url: url, uploadDate: uploadDate}));
    }    

    //get records
    function getRecords(string memory diseaseId)public view returns(Record[] memory){
        require(diseases[diseaseId].doctor == msg.sender ||diseases[diseaseId].patient == msg.sender  , "Unauthorized access to disease records");
        return diesase_record_map[diseaseId];
    }
}
