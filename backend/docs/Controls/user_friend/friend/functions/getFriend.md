[**backend**](../../../../README.md) • **Docs**

***

# Function: getFriend()

> **getFriend**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Retrieves a list of friends for a user, paginated.

## Parameters

• **req**: [`ExtraReq`](../../../../type/interfaces/ExtraReq.md)

An Express request object containing the user's ID and the page number.

• **res**: `Response`\<`any`, `Record`\<`string`, `any`\>\>

An Express response object to send the result of the operation.

## Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

A 200 status code with the list of friends if successful, or a 404 status code with an error message if the friend list is not found.

## Defined in

src/Controls/user\_friend/friend.ts:33
