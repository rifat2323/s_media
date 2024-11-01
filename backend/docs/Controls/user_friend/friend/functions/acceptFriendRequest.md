[**backend**](../../../../README.md) • **Docs**

***

# Function: acceptFriendRequest()

> **acceptFriendRequest**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Accepts a friend request from a user.

## Parameters

• **req**: [`ExtraReq`](../../../../type/interfaces/ExtraReq.md)

An Express request object containing the user's ID and the friend's ID.

• **res**: `Response`\<`any`, `Record`\<`string`, `any`\>\>

An Express response object to send the result of the operation.

## Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

A 200 status code with the message "approved" if the friend request is accepted, or a 400 status code with an error message if either the friend ID is missing or if the friend limit is reached.

## Defined in

src/Controls/user\_friend/friend.ts:178
