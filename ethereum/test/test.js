// test/HealthChain.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("-> HealthChain Test", function () {
  let healthChain, doctor, patient, owner;

  beforeEach(async () => {
    healthChain = await ethers.deployContract("HealthChain");

    const signers = await ethers.getSigners();
    doctor = signers[0];
    patient = signers[1];
    owner = signers[2];
  });

  it("should register a doctor", async () => {
    await healthChain
      .connect(doctor)
      .addDoctor("Dr. Smith", 40, "male", "City Hospital");
    const doc = await healthChain.connect(doctor).getDoctor();
    const role = await healthChain.connect(doctor).getStatus();
    expect(role).to.equal("Doctor");
    expect(doc.name).to.equal("Dr. Smith");
    expect(doc.walletAddress).to.equal(doctor.address);
  });

  it("should register a patient", async () => {
    await healthChain.connect(patient).addPatient("Alice", 25, "female");
    const pat = await healthChain.connect(patient).getPatient();
    const role = await healthChain.connect(patient).getStatus();
    expect(role).to.equal("Patient");
    expect(pat.name).to.equal("Alice");
    expect(pat.walletAddress).to.equal(patient.address);
  });

  it("should allow patient to add disease and doctors to check there patients ", async () => {
    const diseaseId = "ajdshkahskdh";
    await healthChain
      .connect(doctor)
      .addDoctor("Dr. Smith", 40, "male", "City Hospital");
    await healthChain.connect(patient).addPatient("Alice", 25, "female");
    await healthChain
      .connect(patient)
      .addDisease(diseaseId, "Cancer", doctor.address);
    const patients = await healthChain.connect(doctor).getAllPatients();
    expect(patients[0].walletAddress).to.equal(patient.address);

    const patientDiseases = await healthChain
      .connect(doctor)
      .getPatientsDiseases(patient.address);
    expect(patientDiseases[0].id).to.equal(diseaseId);

    const diseaseList = await healthChain.connect(patient).getDiseases();
    expect(diseaseList.map((obj) => obj.id)).to.have.members(
      patientDiseases.map((obj) => obj.id)
    );

    //testing addition of records
    const doc_hash = "hajdslaksd//:";
    await healthChain
      .connect(patient)
      .addRecord("Blood Test", doc_hash, "17/12/2023", diseaseId);
    const records = await healthChain.connect(patient).getRecords(diseaseId);
    expect(doc_hash).to.equal(records[0].url);
    expect("Blood Test").to.equal(records[0].name);
  });
});
