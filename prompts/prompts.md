1.
Generate the data model of the current project on docs/data-model.md
2.
Create a backend-developer subagent
3.
Create a test subagent
4.
Create caracterization tests
5.
/plan-backend-ticket

GET /positions/:id/candidates
Este endpoint recogerá todos los candidatos en proceso para una determinada posición, es decir, todas las aplicaciones para un determinado positionID. Debe proporcionar la siguiente información básica:

Nombre completo del candidato (de la tabla candidate).

current_interview_step: en qué fase del proceso está el candidato (de la tabla application).

La puntuación media del candidato. Recuerda que cada entrevist (interview) realizada por el candidato tiene un score


6.
/plan-backend-ticket

PUT /candidates/:id/stage
Este endpoint actualizará la etapa del candidato movido. Permite modificar la fase actual del proceso de entrevista en la que se encuentra un candidato específico.
