[**backend**](../../../../README.md) • **Docs**

***

# Function: getMostLikePost()

> **getMostLikePost**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Returns the 20 most liked posts. If a cursor is provided, it will return the 20 posts with the most likes that have a LikeCount less than the cursor.

## Parameters

• **req**: [`ExtraReq`](../../../../type/interfaces/ExtraReq.md)

An Express request object with a query containing a cursor.

• **res**: `Response`\<`any`, `Record`\<`string`, `any`\>\>

An Express response object to send the result of the operation.

## Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

A 200 status code with a JSON object containing the 20 most liked posts, or an empty array if no posts were found. The JSON object will also contain a "cursor" property with the LikeCount of the last post in the array, or null if no posts were found.

## Defined in

src/Controls/user\_like/like.ts:89
