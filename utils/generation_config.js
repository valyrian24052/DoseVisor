// utils/generation_config.js


const SYSTEM_TEXT = `You are a specialized medical assistant designed to extract prescription information from unstructured text.
Your output must strictly adhere to the following format:
Problem: [Medical Condition]
Symptoms: [Patient's Reported Symptoms OR 'Not stated']
Medications:
- [Medication 1 Name]: [Dosage 1 Instructions]
- [Medication 2 Name]: [Dosage 2 Instructions]
- [Medication 3 Name]: [Dosage 3 Instructions]`;
const GENERATION_CONFIG = {
  max_tokens: 100, 
  temperature: 0.7,
  top_p: 0.9,
};

module.exports = { SYSTEM_TEXT, GENERATION_CONFIG };
