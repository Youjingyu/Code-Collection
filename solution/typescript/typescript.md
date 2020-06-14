### 类型抽取
```typescript
interface Dictionary<T = any> {
  [key: string]: T;
}
 
type StrDict = Dictionary<string>
// 定义一个含有 Dictionary<T> 中的 T 的类型，即 V
type DictMember<T> = T extends Dictionary<infer V> ? V : never
type StrDictMember = DictMember<StrDict> // string
```
```typescript
// 以 promise 的类型抽取为例
async function stringPromise() {
  return 'Hello, Semlinker!';
}

interface Person {
  name: string;
  age: number;
}

async function personPromise() {
  return <Person>{ name: 'Semlinker', age: 30 };
}

// 先定义一个含有 Promise<T> 的辅助类型
type PromiseType<T> = (args: any[]) => Promise<T>;
type UnPromisify<T> = T extends PromiseType<infer U> ? U : never;

type extractStringPromise = UnPromisify<typeof stringPromise>; // string
type extractPersonPromise = UnPromisify<typeof personPromise>; // Person
```

### nodejs callback 被 promisify 包装后，获取其类型
```typescript
type TPromiseOne<T> =
  T extends ((arg1:infer T1, callback:(err:any, result:infer TResult) => void) => boolean) ? (arg:T1) => Promise<TResult>
  : T extends ((arg1:infer T1, arg2:infer T2, callback:(err:any, result:infer TResult) => void) => boolean) ? (arg:T1, arg2:T2) => Promise<TResult>
  : T extends ((arg1:infer T1, arg2:infer T2, arg3:infer T3, callback:(err:any, result:infer TResult) => void) => boolean) ? (arg:T1, arg2:T2, arg3:T3) => Promise<TResult>
  : T extends ((arg1:infer T1, arg2:infer T2, arg3:infer T3, arg4:infer T4, callback:(err:any, result:infer TResult) => void) => boolean) ? (arg:T1, arg2:T2, arg3:T3, arg4:T4) => Promise<TResult>
  : T extends ((arg1:infer T1, arg2:infer T2, arg3:infer T3, arg4:infer T4, arg5:infer T5, callback:(err:any, result:infer TResult) => void) => boolean) ? (arg:T1, arg2:T2, arg3:T3, arg4:T4, arg5:T5) => Promise<TResult>
  : never;
```