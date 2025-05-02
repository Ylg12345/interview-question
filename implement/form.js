
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
  }, [values]);

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

const Dropdown = ({ options, defaultValue, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(defaultValue || '');
  const dropdownRef = React.useRef(null);

  // 点击外部关闭逻辑
  React.useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // 受控组件支持[11](@ref)
  const handleSelect = (value) => {
    setSelectedValue(value);
    onChange && onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <div className="selected-value" onClick={() => setIsOpen(!isOpen)}>
        {options.find(opt => opt.value === selectedValue) && options.find(opt => opt.value === selectedValue).label || '请选择'}
      </div>
      {isOpen && (
        <div className="options-list">
          {options.map(option => (
            <div 
              key={option.value}
              className="option-item"
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const useLazyImage = ({
  dataSrc,
  placeholderSrc
}) => {

  const [src, setSrc] = React.useState(placeholderSrc);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const imageRef = React.useRef(null);

  const loadImg = React.useCallback(() => {
    const image = new Image();
    image.src = dataSrc;

    image.onload = function() {
      setSrc(dataSrc);
      setIsLoading(false);
    }

    image.onerror = function() {
      setIsError(true);
      setIsLoading(false);
    }

  }, [dataSrc]);


  React.useEffect(() => {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadImg();
          observer.unobserve(entry.target);
        }
      })
    }, {
      root: null,
      rootMargin: '200px',
      threshold: 0.01,
    })

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    }

  }, []);

  return {
    imageRef,
    src,
    isLoading,
    isError,
  }
}

const LazyImage = ({ dataSrc, placeholderSrc }) => {
  const { imageRef, src, isLoading, isError } = useLazyImage({
    dataSrc,
    placeholderSrc
  });

  return (
    <img 
      ref={imageRef}
      src={src}
      style={{
        opactiy: isLoading ? 0.5 : 1,
        transition: 'opactiy 0.3s ease-in-out'
      }}
    />
  )
}


const App = () => {
  const form = React.useRef(null);
  // const { hours, minutes, seconds } = useCountDown(
  //   5 * 3600 + 15 * 60 + 12,
  //   () => {
  //     console.log("111111");
  //   }
  // );


  return (
    <div>
      {/* {hours}:{minutes}:{seconds} */}
      <Dropdown 
        options={[{label: '苹果', value: '苹果'}, {label: '香蕉', value: '香蕉'}]} 
        onChange={(value) => { console.log('value', value) }} 
        // defaultValue={'香蕉'}
      />
      <Form 
        ref={form}
        initialValues={{
          age: 26,
          height: 180,
          selectValue: '2',
        }}
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
