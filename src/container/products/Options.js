import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import qs from '../../libs/qs';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import {
  Contents,
  PageTitle,
  PageSecnTitle,
  FlextCont,
} from '../../components/common';
import Button from '../../components/form/button/Button';
import {
  syrup as koSyrup,
  decaffeine,
  ice,
  milk,
  whipping,
  water,
  onSetTotal,
} from '../../store/options';

const OptionGroup = styled.div`
  > ul > li {
    padding: 20px 10px;
    &:nth-child(even) {
      background: #ededed;
    }
  }
  ul ul li {
    padding: 10px 0 0 0;
  }
  button {
    margin-top: 30px;
    padding: 10px;
  }
`;
const Option = ({ history, location, product, options, onSetTotal }) => {
  const { type, kind } = qs(location);
  const [shotTot, setShotTot] = useState(0);
  const [syrupTot, setSyrupTot] = useState(0);

  const onSetHandlerOptions = useCallback(() => {
    const url = `/view?type=${type}&kind=${kind}`;
    history.push(url);
  }, []);

  useEffect(() => {
    if (options) {
      const price = options.price;
      const shotTotal = options.shot.count * options.shot.extra;
      const mochaTotal = options.syrup.mocha.count * options.syrup.mocha.price;
      const caramelTotal =
        options.syrup.caramel.count * options.syrup.caramel.price;
      const hazelnutTotal =
        options.syrup.hazelnut.count * options.syrup.hazelnut.price;
      const vanillaTotal =
        options.syrup.vanilla.count * options.syrup.vanilla.price;
      const total =
        (price +
          shotTotal +
          mochaTotal +
          caramelTotal +
          hazelnutTotal +
          vanillaTotal) *
        options.count;
      setShotTot(shotTotal);
      setSyrupTot(mochaTotal + caramelTotal + hazelnutTotal + vanillaTotal);
      onSetTotal(total);
    }
  }, [options]);

  return (
    product &&
    options && (
      <Contents>
        <PageTitle>
          {product.en}
          <span className="ko">{product.ko}</span>
        </PageTitle>
        <PageSecnTitle>옵션</PageSecnTitle>
        <OptionGroup>
          <ul>
            <li>
              <Link to={`/details?type=${type}&kind=${kind}&option=shot`}>
                커피 ({shotTot} 원)
                <ul>
                  <li>에스프레소 {options.shot.base + options.shot.count}</li>
                  {options.shot.decaffeine &&
                    Object.keys(options.shot.decaffeine).map(prop =>
                      options.shot.decaffeine[prop] ? (
                        <li key={prop}>{decaffeine[prop]}</li>
                      ) : null,
                    )}
                </ul>
              </Link>
            </li>
            <li>
              <Link to={`/details?type=${type}&kind=${kind}&option=syrup`}>
                시럽 ({syrupTot} 원)
                <ul>
                  {Object.keys(options.syrup).map(prop => {
                    const { base, count } = options.syrup[prop];
                    return base + count > 0 ? (
                      <li key={prop}>
                        {koSyrup[prop]} {base + count}
                      </li>
                    ) : null;
                  })}
                </ul>
              </Link>
            </li>
            {type === 'iced' ? (
              <li>
                <Link to={`/details?type=${type}&kind=${kind}&option=ice`}>
                  얼음
                  <ul>
                    {Object.keys(options.ice).map(prop =>
                      options.ice[prop] ? (
                        <li key={prop}>{ice[prop]}</li>
                      ) : null,
                    )}
                  </ul>
                </Link>
              </li>
            ) : null}
            {kind !== 'espresso'
              ? ((kind === 'americano' ? (
                  <li>
                    <Link
                      to={`/details?type=${type}&kind=${kind}&option=water`}
                    >
                      물
                      <ul>
                        {Object.keys(options.ice).map(prop =>
                          options.water[prop] ? (
                            <li key={prop}>{water[prop]}</li>
                          ) : null,
                        )}
                      </ul>
                    </Link>
                  </li>
                ) : (
                  <>
                    <li>
                      <Link
                        to={`/details?type=${type}&kind=${kind}&option=milk`}
                      >
                        우유
                        <ul>
                          {Object.keys(options.milk.kind).map(prop =>
                            options.milk.kind[prop] ? (
                              <li key={prop}>{milk.kind[prop]}</li>
                            ) : null,
                          )}
                          {Object.keys(options.milk.volume).map(prop =>
                            options.milk.volume[prop] ? (
                              <li key={prop}>우유양 {milk.volume[prop]}</li>
                            ) : null,
                          )}
                        </ul>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`/details?type=${type}&kind=${kind}&option=whipping`}
                      >
                        휘핑
                        <ul>
                          {Object.keys(options.whipping).map(prop =>
                            options.whipping[prop] ? (
                              <li key={prop}>{whipping[prop]}</li>
                            ) : null,
                          )}
                        </ul>
                      </Link>
                    </li>
                  </>
                )): null)
              : null}
          </ul>
          <FlextCont>
            <Button type="submit" kind="base" onClick={onSetHandlerOptions}>
              확인
            </Button>
          </FlextCont>
        </OptionGroup>
      </Contents>
    )
  );
};

const mapStateToProps = ({ product, options }) => ({
  product: product.product,
  options: options.opt,
});

const mapDispatchToProps = { onSetTotal };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Option);
