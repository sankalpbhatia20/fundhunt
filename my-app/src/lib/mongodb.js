import { MongoClient } from 'mongodb'

// Add debugging
console.log('Loading MongoDB client...')
console.log('Environment:', process.env.NODE_ENV)
console.log('MONGODB_URI exists:', process.env.MONGODB_URI)

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}

let client
let clientPromise

// In development mode, use a global variable so that the value
// is preserved across module reloads caused by HMR (Hot Module Replacement).
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise
export default clientPromise

// Add a check to prevent client-side initialization
if (typeof window !== 'undefined') {
  throw new Error(
    'Please do not import this file on the client side. Use server components or API routes instead.'
  )
}