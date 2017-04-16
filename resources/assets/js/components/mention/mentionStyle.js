export default ({
    control: {
        backgroundColor: '#f1f0f0',
        border: 0
    },

    input: {
        margin: 0,
        border: 0
    },

    '&singleLine': {
        control: {
            display: 'inline-block',
            width: 130
        },

        highlighter: {
            padding: 1,
            border: '2px inset transparent'
        },

        input: {
            padding: 1,
            border: 0
        }
    },

    '&multiLine': {
        control: {
            border: 0
        },

        highlighter: {
            padding: 9
        },

        input: {
            padding: 9,
            minHeight: 63,
            outline: 0,
            border: 0
        }
    },

    suggestions: {
        list: {
            backgroundColor: 'white',
            border: '1px solid rgba(0,0,0,0.15)',
            padding: '5px 0px',
            maxHeight: '280px',
            width: '170px',
            overflow: 'auto',
            position: 'absolute',
            bottom: '14px'
        },

        item: {
            padding: '5px 15px',
            '&focused': {
                backgroundColor: '#cee4e5'
            }
        }
    }
});
