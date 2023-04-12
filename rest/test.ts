/* eslint-disable no-console */
const data = `{"id":"chatcmpl-6wodoF7WMhqdeYHkuejmFn4DrKNpI","object":"chat.completion.chunk","created":1679475708,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"content":"This"},"index":0,"finish_reason":null}]}`

console.log('data', data)

console.log('data parse', JSON.parse(data))

const json_string = JSON.stringify(data)

console.log('json_string', json_string)

const json = JSON.parse(json_string)

console.log('json', json)
