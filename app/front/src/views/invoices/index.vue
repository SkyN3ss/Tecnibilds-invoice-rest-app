<style lang="scss">
    .invoiceRow {
        cursor: pointer;
    }
</style>

<template>
    <v-layout column wrap>
            <v-toolbar color="blue" dark>
                <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon>
                    <v-icon>more_vert</v-icon>
                </v-btn>
            </v-toolbar>
                    <v-card flat class="ma-2">
                        <v-card>
                            <v-card-title>
                                <v-flex xs3>
                                    <v-text-field
                                            append-icon="search"
                                            label="Buscar Factura"
                                            single-line
                                            hide-details
                                            v-model="search"
                                    ></v-text-field>
                                </v-flex>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" to="/invoice/create">Crear factura</v-btn>
                                <v-btn icon @click="setInvoices()">
                                    <v-icon>refresh</v-icon>
                                </v-btn>
                                <v-menu bottom left>
                                    <v-btn icon slot="activator">
                                        <v-icon>more_vert</v-icon>
                                    </v-btn>
                                    <v-list>
                                        <v-list-tile>
                                            <v-list-tile-title>asd</v-list-tile-title>
                                        </v-list-tile>
                                    </v-list>
                                </v-menu>
                            </v-card-title>
                            <v-data-table
                                    :headers="headers"
                                    :search="search"
                                    :items="invoices.model"
                                    :pagination.sync="pagination"
                                    item-key="name"
                                    class="elevation-1"
                            >
                                <template slot="headers" slot-scope="props">
                                    <tr>
                                        <th v-for="header in props.headers" :key="header.text"
                                            :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                                            @click="changeSort(header.value)"
                                        >
                                            <v-icon>arrow_upward</v-icon>
                                            {{ header.text }}
                                        </th>
                                    </tr>
                                </template>
                                <template slot="items" slot-scope="props">
                                    <tr @click="seeInvoice(props.item.id)" class="invoiceRow">
                                        <td>{{ props.item.number }}</td>
                                        <td>{{ props.item.title }}</td>
                                        <td class="text-xs-right">{{ props.item.customer.company }}</td>
                                        <td v-if="props.item.status == 0">
                                            <v-chip class="ml-3" disabled small color="light-blue">PENDIENTE</v-chip>
                                        </td>
                                        <td class="text-xs-right" v-else-if="props.item.status == 1">
                                        <v-chip disabled small color="light-green">PAGADA</v-chip>
                                        </td>
                                        <td class="text-xs-right" v-else>
                                            <v-chip disabled small color="red">EXPIRADA</v-chip>
                                        </td>
                                        <td class="text-xs-right">{{ props.item.sub_total }}</td>
                                        <td class="text-xs-right">{{ props.item.iva_percent }}</td>
                                        <td class="text-xs-right">{{ props.item.iva }}</td>
                                        <td class="text-xs-right">{{ props.item.discount }}</td>
                                        <td class="text-xs-right">{{ props.item.total }}</td>
                                    </tr>
                                </template>
                            </v-data-table>
                        </v-card>
                    </v-card>
    </v-layout>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';

  export default {
    data () {
      return {
        pageTitle: 'Facturas',
        selectedProduct: null,
        successMessage: '',
          /* PRODUCTS DATA-TABLE */
        pagination: {
          sortBy: 'number',
        },
        search: '',
        headers: [
          {text: 'No', value: 'number'},
          {text: 'Titulo de la factura', value: 'title'},
          {text: 'Cliente', value: 'customer_id'},
          {text: 'Estado', value: 'status'},
          {text: 'Sub total', value: 'sub_total'},
          {text: 'IVA %', value: 'iva_percent'},
          {text: 'IVA', value: 'iva'},
          {text: 'Descuento', value: 'discount'},
          {text: 'Total', value: 'total'}
        ],
      }
    },
    computed: {
      ...mapGetters({
        invoices: 'getInvoices',
      }),
    },
    created() {
      let vm = this;
      vm.setInvoices();
    },
    methods: {
      ...mapActions({
        setInvoices: 'setInvoices',
      }),
      changeSort (column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column;
          this.pagination.descending = false
        }
      },
      seeInvoice(ID) {
        this.$router.push({ path: '/invoice/show/' + ID })
      },
    }
  }
</script>


