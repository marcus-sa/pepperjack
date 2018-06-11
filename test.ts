import 'reflect-metadata';

let column: Function;

function Column(): Function {
  return (target) => {
    column = target.constructor;
  };
}

class Test {

  @Column()
  public test: string;

}

class Test2 {

}

setTimeout(() => {
  console.log(Test2 === column);
}, 1);

