/* eslint-disable no-unused-vars */
/* eslint-disable valid-jsdoc */
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');

const axios = require('axios');

class DeveloperExtension {
    _debug = '';

    /**
     *
     * @param {Runtime} runtime
     */
    constructor (runtime) {
        this.runtime = runtime;
    }

    getInfo () {
        return {
            id: 'pinecone-developer',
            name: 'Developer',
            color1: '#999999',
            color2: '#000000',
            blocks: [
                {
                    opcode: 'debug',
                    blockType: BlockType.COMMAND,
                    terminal: false,
                    blockAllThreads: false,
                    text: 'debug [VAL]',
                    arguments: {
                        a: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        }
                    }
                },
                {
                    opcode: 'debug_message',
                    blockType: BlockType.REPORTER,
                    terminal: false,
                    blockAllThreads: false,
                    text: 'debug message'
                },
                {
                    opcode: 'axios',
                    blockType: BlockType.REPORTER,
                    terminal: true,
                    blockAllThreads: false,
                    text: 'axios [METHOD] [URL] [DATA]',
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://jsonplaceholder.typicode.com/todos/'
                        },
                        METHOD: {
                            type: ArgumentType.STRING,
                            menu: 'methods'
                        },
                        DATA: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        }
                    }
                },
                {
                    opcode: 'get_object_val',
                    blockType: BlockType.REPORTER,
                    terminal: true,
                    blockAllThreads: false,
                    text: 'get [OBJECT].[PATH]',
                    arguments: {
                        OBJECT: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        },
                        PATH: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        }
                    }
                },
                {
                    opcode: 'set_object_val',
                    blockType: BlockType.COMMAND,
                    terminal: true,
                    blockAllThreads: false,
                    text: 'set [OBJECT].[PATH] to [VAL]',
                    arguments: {
                        OBJECT: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        },
                        PATH: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        },
                        VAL: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        }
                    }
                },
                {
                    opcode: 'object',
                    blockType: BlockType.REPORTER,
                    text: 'Empty object'
                },
                {
                    opcode: 'ternary',
                    blockType: BlockType.REPORTER,
                    text: 'reporter - ternary [CONDITION] ? [IF_TRUE] : [IF_FALSE]',
                    arguments: {
                        CONDITION: {
                            type: ArgumentType.STRING,
                            defaultValue: true
                        },
                        IF_TRUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 1
                        },
                        IF_FALSE: {
                            type: ArgumentType.STRING,
                            defaultValue: 0
                        }
                    }
                }
            ],
            menus: {
                methods: [
                    'GET', 'POST'
                  
                ]
            }
        };
    }

    // /**
    //  *
    //  * @param {object} args
    //  * @param {BlockUtility} info
    //  * @param {object} block
    //  */
    // conditional (args, info, block) {
    //     console.log('conditional args!');
    //     console.dir(args);

    //     // console.log("conditional info!");
    //     // console.dir(info);

    //     // console.log("conditional block!");
    //     // console.dir(block);
    //     return '2';
    // }

    axios (args, info, block) {
        const method = args.METHOD === 'GET' ? axios.get : axios.post;
        console.log('DATA', args.DATA);
        
        return method(args.URL, args.DATA)
            .then(response => JSON.stringify(response));
    }

    /**
     *
     * @param {object} args
     * @param {BlockUtility} info
     * @param {object} block
     * @return
     */
    debug (args, info, block) {
        // console.log('debug args!', {args, info, block});
        console.log('DEBUG', args.VAL);
        this._debug = args.VAL;

        return args.VAL;
    }

    debug_message (){
        return this._debug;
    }

    object (){
        // return {};
        return '{}';
    }

    /**
     *
     * @param {*} args
     * @param {string} args.OBJECT
     * @param {string} args.PATH can be dot notation syntax
     * @returns
     */
    get_object_val (args){
        console.log('get_object_val args', args);
        try {
            const object = JSON.parse(args.OBJECT);
            const path = args.PATH;

            // if (typeof object !== 'object' || typeof path !== 'string'){
            //     // return new Error('bad');
            //     return false;
            // }

            let val = path.split('.').reduce((a, b) => a[b], object);
            if (typeof val !== 'number' && typeof val !== 'string'){
                val = JSON.stringify(val);
            }
            return val;

        } catch (err){
            console.log('get_object_val error', err);
        }
    }

    /**
     *
     * @param {*} args
     * @returns
     * @TODO support dot notation
     */
    set_object_val (args){
        const object = JSON.parse(args.OBJECT);
        console.log('get_object_val object', object);
        object[args.PATH] = args.VAL;

        return JSON.stringify(object);
    }

    /**
     *
     * @param {object} args
     * @param {BlockUtility} info
     * @param {object} block
     * @returns
     */
    ternary (args, info, block) {
        // console.log('ternary args!', {args, info, block});
        const {CONDITION, IF_TRUE, IF_FALSE} = args;
        // console.dir(args);

        return CONDITION ? IF_TRUE : IF_FALSE;
    }
}

module.exports = DeveloperExtension;
