const express = require('express');
const problemRouter = express.Router();





problemRouter.post('/create', createProblem);
problemRouter.patch('/:id', updateProblem);
problemRouter.delete('/:id', deleteProblem);



problemRouter.get('/:id', fetchProblem);
problemRouter.get('/', fetchAllProblems);
problemRouter.get('/user', solvedProblem);



