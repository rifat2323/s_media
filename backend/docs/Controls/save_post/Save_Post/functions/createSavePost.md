[**backend**](../../../../README.md) • **Docs**

***

# Function: createSavePost()

> **createSavePost**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Creates a new save post for a user.

## Parameters

• **req**: [`ExtraReq`](../../../../type/interfaces/ExtraReq.md)

An Express request object containing the user's ID and the post's ID.

• **res**: `Response`\<`any`, `Record`\<`string`, `any`\>\>

An Express response object to send the result of the operation.

## Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

A 200 status code with the newly created save post if successful, or a 400 status code with an error message if the post ID is missing or if the post is already saved.

## Defined in

src/Controls/save\_post/Save\_Post.ts:15
