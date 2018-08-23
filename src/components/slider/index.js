import React from 'react'
import { Paper, Button } from 'react-md'
import PropTypes from 'prop-types'

import './style.scss'

export default class Slider extends React.PureComponent {
  constructor (props) {
    super(props)
    this.container = React.createRef()
  }
  componentDidMount () {
    const bigContainer = this.container.current
    const ro = new ResizeObserver(entries => {
      for (let entry of entries) {
        this.setState({
          bigContainerWidth: entry.contentRect.width
        })
      }
    })
    ro.observe(bigContainer)
  }
  state = {
    currentDot: 0,
    bigContainerWidth: 0
  }
  turn = n => {
    const { currentDot, bigContainerWidth } = this.state
    const { items, itemWidth } = this.props
    const numbersOfPerPage = Math.floor(bigContainerWidth / itemWidth)
    const totalPages = Math.ceil(items.length / numbersOfPerPage)
    let newDot = currentDot + n
    if (newDot < 0) {
      newDot = newDot + totalPages
    }
    if (newDot >= totalPages) {
      newDot = newDot - totalPages
    }
    this.setState({ currentDot: newDot })
  }
  handleNextClick = totalPages => () => {
    const { currentDot } = this.state
    if (currentDot !== totalPages - 1) {
      this.turn(1)
    }
  }
  handlePreClick = () => {
    const { currentDot } = this.state
    if (currentDot !== 0) {
      this.turn(-1)
    }
  }
  handleDotClick = index => () => {
    this.setState({ currentDot: index })
  }
  handleMarginRight = (index, numbersOfPerPage, margin) => {
    if (margin <= 50) {
      margin = 50
    }
    if ((index + 1) % numbersOfPerPage === 0) {
      return `${margin}px`
    } else {
      return `${5}px`
    }
  }
  handleMarginLeft = (index, numbersOfPerPage, margin) => {
    const { currentDot } = this.state
    if (currentDot * numbersOfPerPage === index) {
      return `${margin / 2}px`
    } else {
      return `${5}px`
    }
  }
  render () {
    const { currentDot, bigContainerWidth } = this.state
    const { items, itemWidth, speed } = this.props
    const numbersOfPerPage = Math.floor(bigContainerWidth / itemWidth)
    const totalPages = Math.ceil(items.length / numbersOfPerPage)
    const renderBtn = Boolean(totalPages - 1)
    const margin =
      bigContainerWidth -
      numbersOfPerPage * itemWidth -
      (numbersOfPerPage - 1) * 10
    return (
      <Paper zDepth={1} className="Slider">
        <div className="Slider-top">
          <div
            className="Slider-bigcontainer"
            ref={this.container}
          >
            <div
              className="Slider-container"
              style={{
                transform: `translateX(${-bigContainerWidth * currentDot}px)`,
                transitionDuration: `${speed}s`,
                width: totalPages * 100 + '%'
              }}
            >
              {items.map((i, index) => (
                <div
                  key={index}
                  className="Slider-items"
                  style={{
                    marginRight: this.handleMarginRight(
                      index,
                      numbersOfPerPage,
                      margin
                    ),
                    marginLeft: this.handleMarginLeft(
                      index,
                      numbersOfPerPage,
                      margin
                    ),
                    width: `${itemWidth}px`
                  }}
                >
                  {i.children}
                </div>
              ))}
            </div>
          </div>
        </div>
        {renderBtn && (
          <Button
            floating
            onClick={this.handlePreClick}
            className="Slider-btnleft"
            iconClassName="mdi mdi-chevron-left"
          />
        )}
        {renderBtn && (
          <Button
            floating
            onClick={this.handleNextClick(totalPages)}
            className="Slider-btnright"
            iconClassName="mdi mdi-chevron-right"
          />
        )}
        <div className="Slider-indicators">
          {renderBtn &&
            items.map((c, index) => {
              if (index < totalPages) {
                return (
                  <div
                    key={index}
                    onClick={this.handleDotClick(index)}
                    className={
                      index === currentDot
                        ? 'Slider-indicator-active'
                        : 'Slider-indicator-inactive'
                    }
                  />
                )
              }
            })}
        </div>
      </Paper>
    )
  }
}
Slider.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      children: PropTypes.node
    })
  ).isRequired,
  itemWidth: PropTypes.number,
  speed: PropTypes.number
}
Slider.defaultProps = {
  items: [],
  itemWidth: 300,
  speed: 1
}
