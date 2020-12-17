const gradeController = require('../Controllers/gradeController');
const fs = require('fs');
// aqui adicionamos uma entrada para cada
// combinação de verbo (post, put, delete, get) + /comando
module.exports = (myServer) => {
  // to add another grade
  // post ata must come from request body
  myServer.post('/grade', gradeController.post);

  // to update a pre-existing grade by id
  // put data  must come from request body
  myServer.put('/grade/:id', gradeController.put);

  // to delete a pre-existing grade - id must be given
  myServer.delete('/grade/:id', gradeController.delete);

  // get to list all entries
  myServer.get('/grades', gradeController.get);

  // get all the data from a single grade by id
  myServer.get('/grade/:id', gradeController.getById);

  // calcs the total grade of a student in subject
  myServer.post('/totalgrade', gradeController.getTotalGrade);

  // calcs the avg grade of a type + subject
  myServer.post('/avggrade', gradeController.getAvgBySubjectType);

  // top 3 grades type + subject
  myServer.post('/top3', gradeController.getTop3BySubjectType);

  // list subjects
  myServer.post('/listsubjects', gradeController.listSubjects);

  // list students
  myServer.post('/liststudents', gradeController.listStudents);

  // list types
  myServer.post('/listtypes', gradeController.listTypes);
};
