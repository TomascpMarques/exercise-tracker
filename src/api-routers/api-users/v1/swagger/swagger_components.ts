/**
 * @swagger
 * components:
 *  parameters:
 *    userAgeParam:
 *      name: age
 *      in: query
 *      description: Users age
 *      required: false
 *      schema:
 *        type: string
 *    usersNameParam:
 *      name: name
 *      in: query
 *      description: Users name object
 *      required: false
 *      schema:
 *        type: object
 *        properties:
 *          name:
 *            type: object
 *            properties:
 *              first:
 *                type: string
 *              last:
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
 */
