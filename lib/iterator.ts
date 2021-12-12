export class IteratorArray  implements IterableIterator<any[]> {

    private pointer = 0;

    constructor(protected data: any[]) {}

    public next(): IteratorResult<any[]> {
        if (this.pointer < this.data.length) {
            return {
                done: false,
                value: this.data[this.pointer++]
            }
        } else {
            return {
                done: true,
                value: null
            }
        }
    }

    [Symbol.iterator](): IterableIterator<any[]> {
        return this;
    }

}

export class IteratorObject  implements IterableIterator<object> {

    private pointer = 0;
    private resultArray: any[] = [];

    constructor(protected data: object) {
         Object.keys(data).forEach((i,key): void  => {
             // @ts-ignore
             this.resultArray.push({[`${i}`]: data[i]});
        });
    }

    public next(): IteratorResult<any[]> {
        if (this.pointer < this.resultArray.length) {
            return {
                done: false,
                value: this.resultArray[this.pointer++]
            }
        } else {
            return {
                done: true,
                value: null
            }
        }
    }

    [Symbol.iterator](): IterableIterator<any[]> {
        return this;
    }

}

