# mikro-orm-embeddables-m1-fieldName
## Embeddables: `fieldName` option is ignored

Related GH issue: https://github.com/mikro-orm/mikro-orm/issues/2165

### Getting started
```
# Start mongodb
docker-compose up -d

# Instal dependencies
npm install

# Start application
npm start
```

### Console output
```
$ npm run start

> start
> ts-node --transpile-only src/index.ts

Family {
  members: [
    FamilyMember { relation: 'dad', user: [User] },
    FamilyMember { relation: 'mom', user: [User] }
  ]
}
[
  { relation: 'dad', user: ObjectId('612d248d51f21118e4c84d78') },
  { relation: 'mom', user: ObjectId('612d248d51f21118e4c84d79') }
]
```

Expected relationships to be saved according to `fieldName` property. Instead, it uses the class property name.
