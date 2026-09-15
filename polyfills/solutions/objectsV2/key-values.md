Follow-ups interviewers commonly ask after this (be ready):

"Why for...in + hasOwnProperty instead of just Object.getOwnPropertyNames?" — for...in also walks the prototype chain, which is why the hasOwnProperty check is non-negotiable; skip it and you'd wrongly include inherited enumerable properties.
"What about Symbol keys?" — real Object.keys skips Symbol-keyed properties; this polyfill does too by default, since for...in doesn't enumerate Symbols.
"Make it work for arrays" — it already does, since arrays are objects and their indices are own enumerable string keys. Try myKeys([10,20,30]) → ["0","1","2"].