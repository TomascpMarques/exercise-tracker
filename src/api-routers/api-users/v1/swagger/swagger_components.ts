/**
 * @swagger
 * components:
 *  parameters:
 *    usersFavExerciseParam:
 *      name: favoriteExercise
 *      in: query
 *      description: Users favorite exercise
 *      required: false
 *      schema:
 *        type: string
 *    userCountryParam:
 *      name: country
 *      in: query
 *      description: Users country
 *      required: false
 *      schema:
 *        type: string
 *    userNameParam:
 *      name: usrName
 *      in: query
 *      description: Users platform name
 *      required: false
 *      schema:
 *        type: string
 *    userAgeParam:
 *      name: age
 *      in: query
 *      description: Users age
 *      required: false
 *      schema:
 *        type: string
 *    usersFirstNameParam:
 *      name: first
 *      in: query
 *      description: Users first name
 *      required: false
 *      schema:
 *        type: string
 *    usersLastNameParam:
 *      name: last
 *      in: query
 *      description: Users last name
 *      required: false
 *      schema:
 *        type: string
 *    urlQueryOrdering:
 *      name: order
 *      in: query
 *      description: Ordering of the querys results
 *      schema:
 *        type: object
 *        properties:
 *          order:
 *            type: object
 *            properties:
 *              field:
 *                type: string
 *              direction:
 *                type: string
 *
 *  schemas:
 *    FoundUser:
 *      type: object
 *      properties:
 *        error:
 *          type: string
 *          description: Operation error
 *        user:
 *          $ref: '#/components/schemas/User'
 *    UserNotFound:
 *      type: object
 *      properties:
 *        error:
 *          type: string
 *          description: Operation error
 *        user:
 *          type: object
 *          description: Empty user object
 *    User:
 *      type: object
 *      properties:
 *        favorite_exercise:
 *          type: string
 *        country:
 *          type: string
 *        usrName:
 *          type: string
 *        name:
 *          type: object
 *          properties:
 *            first:
 *              type: string
 *            last:
 *              type: string
 *        age:
 *          type: number
 *    SuccessfulUserRegister:
 *      type: object
 *      properties:
 *        error:
 *          type: string
 *          description: Relates any errors and their probable causes
 *        userID:
 *          type: string
 *          description: Register users ID
 */
