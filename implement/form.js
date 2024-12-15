
const FormContext = React.createContext({});

const Form = React.forwardRef(({
  className,
  style,
  children,
  onFinish,
  initialValues,
}, ref) => {
  const [values, setValues] = React.useState(initialValues ||　{});

  React.useImperativeHandle(ref, () => {
    return {
      getFieldsValue() {
        return values;
      },
      setFieldsValue(newValues) {
        console.log('newValues', newValues);
        const result = {};
        for(let [key, newValue] of Object.entries(newValues)) {
            result[key] = newValue
        }
        setValues(result);
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    onFinish(values);
  }

  return (
    <FormContext.Provider
      value={{
        values,
        onValueChange: (key, value) => {
          setValues(prevValues => ({
            ...prevValues,
            [key]: value,
          }));
        }
      }}
    >
      <form 
        className={className} 
        style={style} 
        onSubmit={handleSubmit}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
});

const Item = ({
  name,
  children,
  label,
  className,
  style,
}) => {
  if (!name) {
    return children;
  }
  
  const { values, onValueChange } = React.useContext(FormContext);
  const [value, setValue] = React.useState(values[name]);

  React.useEffect(() => {
    if (value !== values[name]) {
      setValue(values[name]);
    }
  }, [values, values[name]])

  const childEle = React.cloneElement(children, {
    value,
    onChange: (e) => {
      let newValue = '';
      if (e.target.type === 'checkbox') {
        newValue = e.target.checked;
      } else {
        newValue = e.target.value;
      }
      setValue(newValue);
      onValueChange(name, newValue);
    }
  });

  return (
    <div className={className} style={style}>
      <div>{label && <label>{label}</label>}</div>
      <div>{childEle}</div>
    </div>
  );
};

Form.Item = Item;


// function formatTime(value) {
//   return value < 10 ? `0${value}` : value;
// }
  
// function secondsToTime(secs) {
//   const hours = formatTime(Math.floor(secs / 3600));
//   const minutes = formatTime(Math.floor((secs % 3600) / 60));
//   const seconds = formatTime(Math.floor(secs % 60));
//   return { hours, minutes, seconds };
// }
  
// function useCountDown(initCount, onEnd, time = 1000) {
//   const [count, setCount] = React.useState(initCount);
  
//   React.useEffect(() => {
//     if (count === 0) {
//       onEnd && onEnd();
//       return;
//     }
  
//     const timer = setInterval(() => {
//       setCount((value) => value - 1);
//     }, time);
  
//     return () => clearInterval(timer);
//   }, [initCount, onEnd, time]);
  
//   return secondsToTime(count);
// }

const App = () => {
  const form = React.useRef(null);
  // const { hours, minutes, seconds } = useCountDown(
  //   5 * 3600 + 15 * 60 + 12,
  //   () => {
  //     console.log("111111");
  //   }
  // );

  React.useEffect(() => {
    form.current.setFieldsValue({
      age: 26,
      height: 180,
      selectValue: '2',
    })
  }, []);


  return (
    <div>
      {/* {hours}:{minutes}:{seconds} */}
      <Form 
        ref={form}
        initialValues={{}}
        onFinish={(values) => {
          console.log('values', values);
        }}
      >
        <Form.Item name='age' label='年龄'>
          <input />
        </Form.Item>

        <Form.Item name='height' label='身高'>
          <input />
        </Form.Item>

        <Form.Item name='testRadio'>
          <div>
            <input type="radio" id="contactChoice1" name="contact" value="email" />
            <input type="radio" id="contactChoice2" name="contact" value="phone" />
          </div>
        </Form.Item>

        <Form.Item name='selectValue' label='option值'>
          <select>
            {
              [{ value: '1', lable: 'option1' }, { value: '2', lable: 'option2' }].map((option) => {
                return (
                  <option value={option.value} key={option.value}>
                    {option.lable}
                  </option>
                )
              })
            }
          </select>
        </Form.Item>
        <button htmlType='submit'>提交</button>
      </Form>
    </div>
  );
}

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
