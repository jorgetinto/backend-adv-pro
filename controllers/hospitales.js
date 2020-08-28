const { json } = require("express")
const { response } = require('express');

const Hospital = require('../models/hospital');


const getHospitales = async (req, res = response) => {

    const hospitales = await Hospital.find()
                                     .populate('usuario', 'nombre img');

    res.json({
        ok: true,
        hospitales
    })
}

const crearHospitales = async(req, res = response) => {

    const uid = req.uid;
    const hospital = new Hospital({ usuario: uid,  ...req.body });

    try {

        const hospitalDB = await hospital.save();
        
        res.json({
            ok: json,
            hospital: hospitalDB
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador...'
        });
    }
}

const actualizarHospitales = async (req, res = response) => {  

    try {

        const id    = req.params.id;
        const uid   = req.uid;

        const hospital =  await Hospital.findById(id);

        if (!hospital) {
            res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado por id'
            });
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, { new: true});

        res.json({
            ok: true,
            hospital: hospitalActualizado
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador...'
        });
    }
}

const borrarHospitales = async (req, res = response) => {

    try {

        const id    = req.params.id;

        const hospital =  await Hospital.findById(id);

        if (!hospital) {
            res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado por id'
            });
        }

        await Hospital.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Hospital eliminado'
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador...'
        });
    }
}

module.exports = {
    getHospitales,
    crearHospitales,
    actualizarHospitales,
    borrarHospitales
}