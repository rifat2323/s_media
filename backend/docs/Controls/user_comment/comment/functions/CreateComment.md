[**backend**](../../../../README.md) • **Docs**

***

# Function: CreateComment()

> **CreateComment**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Creates a new comment for a given post.

## Parameters

• **req**: [`ExtraReq`](../../../../type/interfaces/ExtraReq.md)

An Express request object with a middleware attached property of userId, and a body containing a comment and postId.

• **res**: `Response`\<`any`, `Record`\<`string`, `any`\>\>

An Express response object to send the result of the operation.

## Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

A 200 status code with the newly created comment if successful, or a 400 status code with an error message if either the comment or postId is missing.

## Defined in

src/Controls/user\_comment/comment.ts:18
