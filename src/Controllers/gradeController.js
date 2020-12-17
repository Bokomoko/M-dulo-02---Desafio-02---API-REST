const fs = require('fs');
const gradesFileName = './data/grades.json';

function nowTimeStamp() {
  const rightNow = new Date();
  return `${rightNow.getFullYear()}-${to00(rightNow.getMonth())}-${to00(
    rightNow.getDate()
  )}T${to00(rightNow.getHours())}:${to00(rightNow.getMinutes())}:${to00(
    rightNow.getSeconds()
  )}.${+to00(rightNow.getMilliseconds(), 3)}Z`;
}

function to00(number, places) {
  const two = places || 2;
  return String(number).padStart(two, '0');
}

// função para ler um arquivo json, sem estress

// reads a single json file and returns an object
function readJSfile(afile) {
  console.log('Opening file', afile);
  const readString = fs.readFileSync(afile, 'utf8', (error, data) => {
    if (error) throw error;
    console.log('succesfully read data');
    return data;
  });
  return JSON.parse(readString);
}

function saveJSfile(aFile, bunchOfData) {
  fs.writeFileSync(aFile, JSON.stringify(bunchOfData), (error) => {
    if (error) throw error;
    console.log('File', aFile, 'Saved');
  });
}

// para cada verbo temos uma rotina aqui

// post, put, delete , get , getByid

exports.post = (req, res, next) => {
  // usuário mandou um post
  // os dados estão no corpo do req
  // req.body tem um objeto json que contem os dados
  // nova entrada é construida com dados do request
  const newGrade = req.body;

  // le os dados do arquivo json ...
  const dataGrades = readJSfile(gradesFileName);

  // incrementa o último Id usado e já o salva também na nova entrada
  newGrade.id = dataGrades.nextId;
  newGrade.timeStamp = nowTimeStamp();

  let nextId = dataGrades.nextId;
  nextId++;
  dataGrades.nextId = nextId;

  const grades = Array.from(dataGrades.grades);
  grades.push(newGrade);
  dataGrades.grades = grades;
  saveJSfile(gradesFileName, dataGrades);
  console.log('New grade added\n', newGrade);
  res.status(201).send(newGrade);
};

exports.put = (req, res, next) => {
  const id = req.params.id;

  const dataGrades = readJSfile(gradesFileName);
  const grades = Array.from(dataGrades.grades);

  const indexGrade = grades.findIndex((aGrade) => aGrade.id == id);
  const newGrade = req.body;
  if (indexGrade < 0) {
    res.status(204).send('Not Found');
    return;
  }
  const oldGrade = grades[indexGrade];
  oldGrade.student = newGrade.student || oldGrade.student;
  oldGrade.subject = newGrade.subject || oldGrade.subject;
  oldGrade.type = newGrade.type || oldGrade.type;
  oldGrade.value = newGrade.value || oldGrade.value;
  oldGrade.timestamp = nowTimeStamp();
  grades[indexGrade] = oldGrade;
  dataGrades.grades = grades;
  saveJSfile(gradesFileName, dataGrades);
  console.log('Grade updated\n', oldGrade);
  res.status(202).send(oldGrade);
};

exports.delete = (req, res, next) => {
  const id = req.params.id;

  const dataGrades = readJSfile(gradesFileName);
  const grades = Array.from(dataGrades.grades);

  const indexGrade = grades.findIndex((aGrade) => aGrade.id == id);
  const newGrade = req.body;
  if (indexGrade < 0) {
    res.status(204).send({ response: 'Not Found' });
    return;
  }
  const deletedGrade = grades.splice(indexGrade, 1);
  dataGrades.grades = grades;
  saveJSfile(gradesFileName, dataGrades);
  console.log('Grade deleted\n', deletedGrade);
  res.status(202).send(deletedGrade);
};

exports.getById = (req, res, next) => {
  const id = req.params.id;
  const dataGrades = readJSfile(gradesFileName);
  const grades = Array.from(dataGrades.grades);
  const indexGrade = grades.findIndex((aGrade) => aGrade.id == id);
  const newGrade = req.body;
  if (indexGrade < 0) {
    res.status(204).send({ response: 'Not Found' });
    return;
  }
  console.log('Get Grade succeded\n', grades[indexGrade]);
  res.status(200).send(grades[indexGrade]);
};
exports.get = (req, res, next) => {
  const dataGrades = readJSfile(gradesFileName);
  res.status(200).send(dataGrades.grades);
};
exports.getTotalGrade = (req, res, next) => {
  const { student, subject } = req.body;
  const dataGrades = readJSfile(gradesFileName);
  const grades = Array.from(dataGrades.grades);
  const totalGrade = grades.reduce((previous, current) => {
    if (current.student == student && current.subject == subject)
      previous += current.value;
    return previous;
  }, 0);
  const response = {
    student,
    subject,
    totalGrade,
  };
  res.status(200).send(response);
};

exports.getAvgBySubjectType = (req, res, next) => {
  const { subject, type } = req.body;
  const dataGrades = readJSfile(gradesFileName);
  const grades = Array.from(dataGrades.grades);
  const { qtd, total } = grades.reduce(
    (previous, current) => {
      if (current.subject == subject && current.type == type) {
        previous.qtd++;
        previous.total += current.value;
      }
      return previous;
    },
    { qtd: 0, total: 0 }
  );
  console.log(qtd, total);
  response = {
    subject,
    type,
    average: total / qtd,
  };
  res.status(200).send(response);
};

// top 3 grades type + subject
exports.getTop3BySubjectType = (req, res, next) => {
  const { subject, type } = req.body;
  const dataGrades = readJSfile(gradesFileName);
  const grades = Array.from(dataGrades.grades);
  const filteredGrades = grades
    .filter((current) => current.subject == subject && current.type == type)
    .sort((menor, maior) => maior.value - menor.value);
  const top3 = filteredGrades.slice(0, 3);
  response = {
    subject,
    type,
    top3,
  };
  res.status(200).send(response);
};

// list subjects
exports.listSubjects = (req, res, next) => {
  const dataGrades = readJSfile(gradesFileName);
  const grades = Array.from(dataGrades.grades);
  const justSubjects = new Set(grades.map((current) => current.subject));
  const subjects = Array.from(justSubjects);
  response = {
    subjects,
  };
  res.status(200).send(response);
};

// list students
exports.listStudents = (req, res, next) => {
  const dataGrades = readJSfile(gradesFileName);
  const grades = Array.from(dataGrades.grades);
  const justStudents = new Set(grades.map((current) => current.student));
  const students = Array.from(justStudents);
  response = {
    students,
  };
  res.status(200).send(response);
};
// list types
exports.listTypes = (req, res, next) => {
  const dataGrades = readJSfile(gradesFileName);
  const grades = Array.from(dataGrades.grades);
  const justTypes = new Set(grades.map((current) => current.type));
  const types = Array.from(justTypes);
  response = {
    types,
  };
  res.status(200).send(response);
};
