
# Sample REST API written in NodeJS
## sample database in a JSON file
### todo
- Store data in MongoDB
- Change some POSTS  to GET
- Optimize routes. They´re OK but could be better

## List of services
 |**Action**                                      |Verb  | URL           |
 |Insert new grade into the system             |POST  |/grade         |
 |Update pre-existing grade by Id              |PUT   |/grade/:id     |
 |Delete a pre-existing grade by Id            |DELETE|/grade/:id     |
 |List all grades                              |GET   |/grades        |
 |Get all the data from grade by id            |GET   |/grade/:id     |
 |Calcs the total grade of a student in subject|POST  |/totalgrade    |
 |Calcs the avg grade of a type + subject      |POST  |/avggrade      |
 |Get top 3 grades by type + subject           |POST  |/top3          |
 |List subjects                                |POST  |/listsubjects  |
 |List students                                |POST  |/liststudents  |
 |List types                                   |POST  |/listtypes     |
=======

