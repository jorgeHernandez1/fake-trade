import React, { useState, useEffect } from 'react';
import { apiAuth, apiUsers, apiIEX, apiTransactions } from '../utils/api';
import { useAuth } from '../utils/context';
import {
  TextInput,
  Row,
  Col,
  Button,
  Icon,
  DatePicker,
  Autocomplete,
  CollectionItem,
  Collection,
  Table,
} from 'react-materialize';
import M from 'materialize-css/dist/js/materialize.min.js';
import { Chart } from 'chart.js';

export function Dashboard() {
  const [state, setState] = useState({
    user: null,
    quantity: 0,
    symbol: '',
    company_name: '',
    stock_price: 0.0,
    calculated_total: 0.0,
    asOfDate: null,
    error: null,
  });

  const { auth, setAuth } = useAuth();

  useEffect(() => {
    if (auth?.user) {
      setState({ ...state, user: auth.user });
    } else {
      apiUsers
        .getDasboard()
        .then((res) => {
          if (res.data.id) {
            // Add symbols to user state
            apiIEX.searchSymbols().then((iexRes) => {
              res.data['iexSymbolResults'] = iexRes.data;
              // For local read/update/delete
              setState({ ...state, user: res.data });
              // For local auth context
              setAuth({ ...auth, user: res.data });
              // For persistent auth
              apiAuth.setAuth({ ...auth, user: res.data });
            });
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  }, []);

  useEffect(() => {
    if (state.stock_price > 0) {
      setState({
        ...state,
        calculated_total: (state.quantity * state.stock_price).toFixed(2),
      });
    }
  }, [state.quantity]);

  useEffect(() => {
    if (state.symbol !== '') {
      const filteredItems = state.user.iexSymbolResults
        .filter((sym) => {
          return sym.symbol.startsWith(state.symbol);
        })
        .slice(0, 99);

      const formattedItems = {};

      filteredItems.forEach((sym) => {
        formattedItems[sym.symbol] = null;
      });

      var elem = document.querySelector('.autocomplete');
      var instance = M.Autocomplete.getInstance(elem);
      instance.updateData(formattedItems);
      instance.open();
    }
  }, [state.symbol]);

  useEffect(() => {
    if (state.symbol) {
      apiIEX
        .searchPrice({
          symbol: state.symbol,
          asOfDate: state.asOfDate,
        })
        .then((res) => {
          if (res.data.latestPrice !== undefined) {
            setState({
              ...state,
              company_name: res.data.companyInfo.companyName,
              stock_price: res.data.latestPrice,
            });
          } else {
            setState({
              ...state,
              company_name: res.data[0].companyInfo.companyName,
              stock_price: res.data[0].fClose,
            });
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  }, [state.asOfDate]);

  const draw = () => {
    // Draw most active
    const mstActCtx = document.getElementById('mostActiveChart');
    const mostActiveBar = new Chart(mstActCtx, {
      type: 'bar',
      data: {
        labels: state.user.mostActiveToday.map((sec) => sec.symbol),
        datasets: [
          {
            label: 'Volume in MM',
            data: state.user.mostActiveToday.map((sec) =>
              (sec.volume / 1000000).toFixed(2)
            ),
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: 'Most Active Today',
        },
      },
    });

    const myPortDataLabels = state.user.MasterSecurities.id
      ? state.user.MasterSecurities.map((sec) => sec.symbol)
      : ['None'];

    const myPortDataSet = state.user.MasterSecurities.id
      ? state.user.MasterSecurities.map((sec) => sec.quantity)
      : [0];

    // Draw my prtfolio
    const myPrtCtx = document.getElementById('myPortfolioChart');
    const myPortfolioLine = new Chart(myPrtCtx, {
      type: 'doughnut',
      data: {
        labels: myPortDataLabels,
        datasets: [
          {
            data: myPortDataSet,
          },
        ],
      },
      options: {
        legend: {
          display: true,
          labels: {
            fontColor: 'rgb(255, 99, 132)',
          },
        },
        title: {
          display: true,
          text: `${state.user.displayName}'s Portfolio`,
        },
      },
    });
  };

  function _handleChange(event) {
    let name, value;
    if (event['target'] !== undefined) {
      name = event.target.name;
      value = event.target.value;
    } else {
      // Reformat as of date field
      name = 'asOfDate';
      value = new Intl.DateTimeFormat().format(event);
    }

    setState({ ...state, [name]: value });
  }

  function _handleClick() {
    const { symbol, asOfDate, quantity, stock_price, calculated_total } = state;

    if (
      Number(calculated_total) > Number(state.user.AccountDatum.cash_balance)
    ) {
      setState({
        ...state,
        error:
          'You do not have enough money to purchase this stock. Add more funds in Cash Management.',
      });
    } else {
      const newStock = {
        symbol,
        asOfDate,
        quantity,
        stock_price,
        calculated_total,
      };

      const resp = apiTransactions.addStock(newStock).then(() => {
        apiUsers.getDasboard().then((res) => {
          if (res.data.id) {
            // Add symbols to user state
            apiIEX.searchSymbols().then((iexRes) => {
              res.data['iexSymbolResults'] = iexRes.data;
              // For local read/update/delete
              setState({
                ...state,
                user: res.data,
                symbol: '',
                asOfDate: '',
                quantity: '',
                company_name: '',
                stock_price: '',
                calculated_total: '',
              });
              // For local auth context
              setAuth({ ...auth, user: res.data });
              // For persistent auth
              apiAuth.setAuth({ ...auth, user: res.data });
            });
          }
        });
      });
    }
  }

  return (
    <>
      <Row className='black-text center'>
        <Row>
          <Col m={7} s={12}>
            {state.user && draw()}
            <canvas id='mostActiveChart'></canvas>
          </Col>
          <Col m={5} s={12}>
            {state.user && draw()}
            <canvas id='myPortfolioChart'></canvas>
          </Col>
        </Row>

        <Row className='valign-wrapper'>
          <Col m={6}>
            <form>
              <Autocomplete
                s={12}
                label='Symbol'
                name='symbol'
                id='symbol'
                onChange={_handleChange}
                value={state.symbol}
                options={{
                  data: {},
                }}
                placeholder='Symbol / Company Name'
              />
              <DatePicker
                s={12}
                onChange={_handleChange}
                value={state.asOfDate}
                label='As of Date'
                name='asOfDate'
                options={{
                  autoClose: true,
                  defaultDate: Date(),
                  disableDayFn: null,
                  disableWeekends: false,
                  events: [],
                  firstDay: 0,
                  format: 'm/d/yyyy',
                  i18n: {
                    cancel: 'Cancel',
                    clear: 'Clear',
                    done: 'Ok',
                    months: [
                      'January',
                      'February',
                      'March',
                      'April',
                      'May',
                      'June',
                      'July',
                      'August',
                      'September',
                      'October',
                      'November',
                      'December',
                    ],
                    monthsShort: [
                      'Jan',
                      'Feb',
                      'Mar',
                      'Apr',
                      'May',
                      'Jun',
                      'Jul',
                      'Aug',
                      'Sep',
                      'Oct',
                      'Nov',
                      'Dec',
                    ],
                    nextMonth: '›',
                    previousMonth: '‹',
                    weekdays: [
                      'Sunday',
                      'Monday',
                      'Tuesday',
                      'Wednesday',
                      'Thursday',
                      'Friday',
                      'Saturday',
                    ],
                    weekdaysAbbrev: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
                    weekdaysShort: [
                      'Sun',
                      'Mon',
                      'Tue',
                      'Wed',
                      'Thu',
                      'Fri',
                      'Sat',
                    ],
                  },
                  isRTL: false,
                  maxDate: null,
                  minDate: null,
                  onClose: null,
                  onDraw: null,
                  onOpen: null,
                  onSelect: null,
                  parse: null,
                  setDefaultDate: Date,
                  showClearBtn: false,
                  showDaysInNextAndPreviousMonths: false,
                  showMonthAfterYear: false,
                  yearRange: 7,
                }}
              />
              <TextInput
                onChange={_handleChange}
                value={state.quantity}
                s={12}
                name='quantity'
                label='Quantity'
                type='number'
              />
            </form>
          </Col>

          <Col m={6} s={12}>
            <Collection>
              <CollectionItem>
                Available Cash:{' '}
                {state.user && state.user.AccountDatum.cash_balance}
              </CollectionItem>
              <CollectionItem>
                Company: {state.company_name && state.company_name}
              </CollectionItem>
              <CollectionItem>
                Stock Price: {state.user && state.stock_price}
              </CollectionItem>
              <CollectionItem>
                Total: {state.user && state.calculated_total}
              </CollectionItem>
            </Collection>
          </Col>
        </Row>
        <Row>
          <h6 className='red-text'>{state.error && state.error}</h6>
        </Row>
        <Button
          m={1}
          className='green'
          floating
          icon={<Icon>add</Icon>}
          large
          node='button'
          onClick={_handleClick}
        />
        <Row>
          {state.user && <h3>{state.user.displayName}'s Stocks</h3>}
          <Row>
            <Table>
              <thead>
                <tr>
                  <th data-field='symbol'>Symbol</th>
                  <th data-field='quantity'>Quantity</th>
                  <th data-field='price'>Average Cost</th>
                  <th data-field='value'>Total Value</th>
                </tr>
              </thead>
              <tbody>
                {state.user ? (
                  state.user.MasterSecurities.map((listValue, index) => {
                    return (
                      <tr key={index}>
                        <td>{listValue.symbol}</td>
                        <td>{listValue.quantity}</td>
                        <td>{listValue.current_unit_cost}</td>
                        <td>
                          {(
                            listValue.current_unit_cost * listValue.quantity
                          ).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td>Add</td>
                    <td>New</td>
                    <td>Stocks</td>
                    <td>Today</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Row>
        </Row>
      </Row>
    </>
  );
}
