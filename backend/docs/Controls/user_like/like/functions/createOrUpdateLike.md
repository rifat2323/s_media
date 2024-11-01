[**backend**](../../../../README.md) • **Docs**

***

# Function: createOrUpdateLike()

> **createOrUpdateLike**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Creates or updates a like for a post.

## Parameters

• **req**: [`ExtraReq`](../../../../type/interfaces/ExtraReq.md)

An Express request object containing the user's ID, the post's ID, and the poster's ID.

• **res**: `Response`\<`any`, `Record`\<`string`, `any`\>\>

An Express response object to send the result of the operation.

## Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

A 200 status code with the message "liked" if the user has liked the post before, or a 200 status code with the message "unliked" if the user has not liked the post before.

## Defined in

src/Controls/user\_like/like.ts:18
