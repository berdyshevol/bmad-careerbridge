```text
commit c99c226
Story 1.2: stored enums and the two state machines — review fixes, S9 error tests


 .../implementation-artifacts/deferred-work.md      |   5 +
 ...-1-2-stored-enums-and-the-two-state-machines.md |  48 ++++++++--
 .../implementation-artifacts/sprint-status.yaml    |   4 +-
 server/README.md                                   |   2 +
 server/package.json                                |   2 +-
 server/src/business/domain/applicationStage.js     |  12 ++-
 .../src/business/domain/applicationStage.test.js   |  24 ++++-
 server/src/business/domain/postingStatus.js        |  10 +-
 server/src/business/domain/postingStatus.test.js   |  37 +++++++-
 server/src/business/errors.js                      |  30 +++---
 server/src/business/errors.test.js                 | 101 +++++++++++++++++++++
 11 files changed, 240 insertions(+), 35 deletions(-)

$ npm test
Test Suites: 4 passed, 4 total
Tests:       268 passed, 268 total
Time:        0.229 s, estimated 1 s
```
