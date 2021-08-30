
import { Embeddable, Embedded, Entity, PrimaryKey, Property, MikroORM, wrap, ManyToOne } from '@mikro-orm/core'
import { MongoDriver, ObjectId } from '@mikro-orm/mongodb'


@Entity()
export class User {
  @PrimaryKey()
  _id!: ObjectId

  @Property()
  name: string = ''

  constructor (name: string) {
    this.name = name
  }
}

@Embeddable()
export class FamilyMember {
  @Property()
  relation: string = 'brother'

  @ManyToOne(() => User, { eager: true, fieldName: 'user_id' }) // we want to save our relationship inside a `user_id` field
  user: User
}

@Entity()
export class Family {
  @PrimaryKey()
  _id!: ObjectId

  @Embedded(() => FamilyMember, { array: true })
  members: FamilyMember[] = []
}


const entrypoint = async () => {
  const orm = await MikroORM.init<MongoDriver>({
    entities: [FamilyMember, User, Family],
    dbName: 'main',
    type: 'mongo',
    implicitTransactions: false,
    forceEntityConstructor: true
  })

  // Cleanup
  await orm.em.nativeDelete(Family, {})
  await orm.em.nativeDelete(User, {})

  const family = new Family()

  const dad = new FamilyMember()
  dad.relation = 'dad'
  dad.user = new User('John')
  family.members.push(dad)

  const mom = new FamilyMember()
  mom.relation = 'mom'
  mom.user = new User('Jane')
  family.members.push(mom)

  console.log(family)

  await orm.em.persistAndFlush(family)

  const nativeResults: Family[] = await orm.em.getConnection().getCollection(Family).find({}).toArray()

  // Relationship is saved in `user` field instead of `user_id`
  console.log(nativeResults[0].members)

  orm.close()
}

entrypoint()