[**backend**](../../../../README.md) • **Docs**

***

# Function: getSavePost()

> **getSavePost**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Retrieves a list of saved posts for a user, paginated.

## Parameters

• **req**: [`ExtraReq`](../../../../type/interfaces/ExtraReq.md)

An Express request object containing the user's ID and the page number.

• **res**: `Response`\<`any`, `Record`\<`string`, `any`\>\>

An Express response object to send the result of the operation.

## Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

A 200 status code with the list of saved posts if successful, or a 400 status code with an error message if the page number is invalid.

## Defined in

src/Controls/save\_post/Save\_Post.ts:41
