import { Modal, ModalBody } from "react-bootstrap"
import { useState } from "react"
const LoadingModal = function({isOpen,setIsOpen}){
    function onClose(){
        setIsOpen(false)
    }
    let LoadingSVG = (
        <svg width="600px" height="600px" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" id="ej15Zn7wxJc1" viewBox="0 0 300 300" shapeRendering="geometricPrecision" textRendering="geometricPrecision" project-id="129902a8724c4c929a73d37372166181" export-id="07a717103fcc442ca4d4e0b1fe89245c" cached="false">
            <text dx="-5" dy="-5" fontSize="20" fontWeight="600" transform="matrix(1.965371 0 0 1.999304 77.831125 114.291052)" fill="#007599" strokeWidth="0">
                <tspan y="15" fontWeight="600" className="NBCCFont" strokeWidth="10">LOADING...</tspan>
            </text>
            <ellipse className="LoadingSVGDot1" rx="8.691164" ry="8.410803" transform="translate(103.756243 190.728743)" fill="#007599" strokeWidth="0"/>
            <ellipse className="LoadingSVGDot2" rx="8.691164" ry="8.410803" transform="translate(130.670814 190.728743)" fill="#829600" strokeWidth="0"/>
            <ellipse className="LoadingSVGDot3" rx="8.691164" ry="8.410803" transform="translate(185.621395 190.728743)" fill="#a1d8e0" strokeWidth="0"/>
            <ellipse className="LoadingSVGDot4" rx="8.691164" ry="8.410803" transform="translate(158.691164 190.728743)" fill="#eaab00" strokeWidth="0"/>

        </svg>
    )
    return (
        <Modal
        show={isOpen}
        onHide={onClose}
        size="xl"
        centered
        className="loadingModal w-100"
        backdrop="static"
        >
            <ModalBody className="d-flex justify-content-center">
            {LoadingSVG}
            </ModalBody>
        </Modal>
    )
}

export default LoadingModal