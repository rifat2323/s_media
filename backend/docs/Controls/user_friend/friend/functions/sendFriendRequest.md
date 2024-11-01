[**backend**](../../../../README.md) • **Docs**

***

# Function: sendFriendRequest()

> **sendFriendRequest**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Sends a friend request to a user.

## Parameters

• **req**: [`ExtraReq`](../../../../type/interfaces/ExtraReq.md)

An Express request object containing the user's ID and the friend's ID.

• **res**: `Response`\<`any`, `Record`\<`string`, `any`\>\>

An Express response object to send the result of the operation.

## Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

A 200 status code with the newly created friend request if successful, or a 400 status code with an error message if the friend limit is reached or if the friend ID is missing, or a 404 status code with an error message if the friend request is not created.

## Defined in

src/Controls/user\_friend/friend.ts:90
