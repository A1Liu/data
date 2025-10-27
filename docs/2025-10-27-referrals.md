# Referrals system
- single table


## Queries

### Frequent
- Add referral
- Check status of user in referral chain
- Aggregate referral chains at point for stats
- Check number of downstream referrals of user

### Infrequent
- Kill referral chain
- Freeze referral chain
- Promote user to a referral chain parent

## Ideas

### Chained UUIDS
Use variable length byte-array IDs, so that we can use compute parent IDs quickly, and use B-Tree indexes to get children.
```
uint64 (uint8)+
^       ^ - subsequent values in chain
base of chain
```

Common *good* case will be long chains.
Common *bad* case will be wide trees.


### Just use parent UUID
keep it simple. Assume the referral chain killing will be bottom-up, and can be a little slow.

